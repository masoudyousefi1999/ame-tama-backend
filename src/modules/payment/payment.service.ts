import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { OrderService } from '../../modules/order/services/order.service';
import type { UserEntity } from '../../modules/user/user.entity';
import { OrderStatusEnum } from '../../modules/order/enum/order-status.enum';
import { PaymentStatusEnum } from './enum/payment-status.enum';
import { getPaymentDriver, Zarinpal } from './../../payment-driver';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { TransactionService } from '../../modules/transaction/transaction.service';
import { PaymentEntity } from './entity/payment.entity';
import { WalletService } from '../../modules/wallet/wallet.service';
import axios from 'axios';
import { calculateShaparakFees } from './shaparak/shaparak.fee';
import { SuccessPurchaseSms } from '../../common/utils';
import { ProductService } from '../../modules/product/product.service';
import { ShippingMethodService } from '../../modules/shipping-method/shipping-method.service';

@Injectable()
export class PaymentService {
  private isSandBoxMode: boolean = false;

  constructor(
    private paymentRepo: PaymentRepository,
    private orderService: OrderService,
    private transactionService: TransactionService,
    private walletService: WalletService,
    private productService: ProductService,
    private shippingMethodService: ShippingMethodService,
  ) {
    this.isSandBoxMode = process.env.ZARINPAL_SANDBOX == 'true' ? true : false;
  }

  async create(user: UserEntity) {
    try {
      const order = await this.orderService.findOneOrder(
        {
          status: OrderStatusEnum.OPEN,
          userId: user.id,
        },
        ['items', 'items.product'],
      );

      if (!order) {
        throw new NotFoundException('order not founded');
      }

      if (order.items?.length === 0) {
        throw new BadRequestException(
          'first add product on to your order then buy.',
        );
      }

      let totalPrice = 0;

      order.items?.forEach(
        (item) =>
          (totalPrice += Number(
            this.productService.getProductPrice(item?.product!),
          )),
      );

      // start: adding post method price to total price
      const shippingMethod =
        await this.shippingMethodService.getAllShippingMethods();
      const postMethod = shippingMethod?.[0];

      totalPrice += Number(postMethod?.price) || 0;
      // end: adding post method price to total price

      totalPrice = Math.floor(totalPrice);

      const feeData = {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID!,
        amount: Number(totalPrice),
        currency: 'IRR',
      };

      const fee = await axios.post(
        'https://payment.zarinpal.com/pg/v4/payment/feeCalculation.json',
        feeData,
      );

      const calculatedFee = fee?.data?.data?.suggested_amount || totalPrice;

      const finalFee = calculateShaparakFees(calculatedFee);

      let finalAmount = finalFee?.finalAmount || calculatedFee;

      finalAmount = Math.floor(finalAmount);

      const payment = await this.paymentRepo.create({
        amount: finalAmount,
        orderId: order.id,
        status: PaymentStatusEnum.PENDING,
      });

      const startPay = await this.startPay({
        amount: finalAmount,
        phone: user?.phone!,
      });

      await this.transactionService.createTransaction({
        amount: finalAmount,
        method: 'GATEWAY',
        paymentId: payment?.id,
        referenceId: startPay?.referenceId! as string,
      });

      if (payment) {
        await this.orderService.pendingOrder({
          orderId: payment.orderId,
          userId: user.id,
        });
      }

      return startPay;
    } catch (error) {
      console.log(
        (error as any).response.data.errors || (error as any)?.message,
      );
      throw new BadRequestException('transaction failed');
    }
  }

  async startPay({ amount, phone }: { amount: number; phone: string }) {
    const driver = getPaymentDriver<Zarinpal>('zarinpal', {
      merchantId: process.env.ZARINPAL_MERCHANT_ID!,
      sandbox: this.isSandBoxMode,
    });

    const paymentInfo = await driver.requestPayment({
      amount: Number(amount),
      description: 'خرید از ame-tama',
      callbackUrl: `${process.env.ZARINPAL_CALLBACK_URL}/payments/zarinpal/callback`,
      mobile: phone,
    });

    const referenceId = paymentInfo.referenceId;
    const url = paymentInfo.url;

    return {
      referenceId,
      url,
    };
  }

  async verifyPayment(user: UserEntity, verifyPaymentDto: VerifyPaymentDto) {
    const { authority, status } = verifyPaymentDto;

    const driver = getPaymentDriver<Zarinpal>('zarinpal', {
      merchantId: process.env.ZARINPAL_MERCHANT_ID!,
      sandbox: this.isSandBoxMode,
    });

    const currentTransaction = await this.transactionService.findOneTransaction(
      {
        referenceId: authority,
      },
    );

    if (!currentTransaction) {
      throw new BadRequestException('Invalid payment transaction');
    }

    let payment: PaymentEntity | null = null;
    if (currentTransaction.paymentId) {
      payment = await this.paymentRepo.findOne({
        filter: { id: currentTransaction.paymentId },
      });
    }

    try {
      const paymentInfo = await driver.verifyPayment(
        {
          amount: Number(currentTransaction.amount),
        },
        { Authority: authority, Status: status },
      );

      if (paymentInfo?.transactionId) {
        await this.transactionService.updateTransaction(currentTransaction.id, {
          responseData: paymentInfo?.raw,
          trackingCode: paymentInfo?.cardPan!,
          paidAt: new Date() as unknown as string,
        });

        if (payment) {
          await this.paymentRepo.update({
            filter: { id: payment.id },
            updateData: { status: PaymentStatusEnum.PAID },
          });
        }

        // payment is successful charge the use wallet
        await this.walletService.depositOrWithdrawal({
          amount: Number(currentTransaction.amount),
          transactionDirection: 'deposit',
          user,
          transactionInitiator: 'user',
          description: 'خرید محصول',
          payment,
        });

        // change order status to complete
        if (payment) {
          await this.orderService.completeOrder({
            orderId: payment.orderId,
            finalPrice: currentTransaction.amount,
            totalPrice: currentTransaction.amount,
            payment,
            user,
          });

          try {
            SuccessPurchaseSms(user.phone!);
          } catch (error) {
            console.log(error);
          }
        }
      }

      return paymentInfo;
    } catch (err) {
      console.log(err);
      if (currentTransaction.paymentId) {
        const payment = await this.paymentRepo.update({
          filter: { id: currentTransaction.paymentId },
          updateData: { status: PaymentStatusEnum.FAILED },
        });

        await this.orderService.failedOrder({ orderId: payment?.orderId! });
      }

      throw new BadRequestException('transaction failed');
    }
  }
}
