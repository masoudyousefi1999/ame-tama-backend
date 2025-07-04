import { PaginationDto } from './../../../common/dto/pagination.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import type { UserEntity } from 'modules/user/user.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { ChangeOrderItemDto } from '../dto/change-order-item.dto';
import { OrderItemService } from './order-item.service';
import { ProductService } from '../../../modules/product/product.service';
import type { OrderEntity } from '../entity/order.entity';
import { type FindOptionsWhere } from 'typeorm';
import { WalletService } from '../../../modules/wallet/wallet.service';
import { PaymentEntity } from '../../../modules/payment/entity/payment.entity';
import type { OrderDto } from '../dto/order.dto';
import { UserAddressService } from '../../../modules/user-address/user-address.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private OrderItemService: OrderItemService,
    private productService: ProductService,
    private walletService: WalletService,
    private userAddressService: UserAddressService,
  ) {}

  async getOrCreateOrder(
    user: UserEntity,
    relationFetch?: boolean,
  ): Promise<OrderEntity> {
    if (!user) {
      throw new ForbiddenException();
    }

    const isUserHavePendingOrder = await this.orderRepo.findOne({
      filter: { status: OrderStatusEnum.PENDING },
    });

    if (isUserHavePendingOrder) {
      await this.orderRepo.update({
        filter: { id: isUserHavePendingOrder.id },
        updateData: { status: OrderStatusEnum.OPEN, addressId: null as any },
      });
    }

    const order = await this.orderRepo.findOne({
      filter: { userId: user.id, status: OrderStatusEnum.OPEN },
      ...(relationFetch
        ? {
            relations: [
              'items',
              'items.product',
              'items.product.productMedia',
              'items.product.productMedia.media',
            ],
          }
        : {}),
    });

    if (order) {
      return order;
    }

    const newOrder = await this.orderRepo.create({
      status: OrderStatusEnum.OPEN,
      userId: user.id,
    });

    return newOrder;
  }

  async addOrIncreaseItem(
    user: UserEntity,
    changeOrderItemDto: ChangeOrderItemDto,
  ) {
    const { productId, quantity } = changeOrderItemDto;
    const currentOrder = await this.getOrCreateOrder(user, false);

    const product = await this.productService.findOneProduct({
      uuid: productId,
    });

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    await this.OrderItemService.addOrIncreaseItem({
      orderId: currentOrder.id,
      product,
      quantity,
    });

    const finalOrder = await this.getOrCreateOrder(user);

    return finalOrder.toDto();
  }

  async removeOrDecreaseItem(
    user: UserEntity,
    changeOrderItemDto: ChangeOrderItemDto,
  ) {
    const { productId, quantity } = changeOrderItemDto;
    const currentOrder = await this.getOrCreateOrder(user);

    const product = await this.productService.findOneProduct({
      uuid: productId,
    });

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    await this.OrderItemService.removeOrDecreaseItem({
      orderId: currentOrder.id,
      productId: product.id,
      quantity,
    });

    const finalOrder = await this.getOrCreateOrder(user);

    return finalOrder.toDto();
  }

  async findOneOrder(
    filter: FindOptionsWhere<OrderEntity> | FindOptionsWhere<OrderEntity>[],
    relations?: string[],
  ) {
    return await this.orderRepo.findOne({ filter, relations });
  }

  async completeOrder(data: {
    orderId: number;
    finalPrice: number;
    totalPrice: number;
    user: UserEntity;
    payment: PaymentEntity;
  }) {
    const { finalPrice, orderId, totalPrice, user, payment } = data;

    await this.orderRepo.update({
      filter: { id: orderId },
      updateData: { finalPrice, totalPrice, status: OrderStatusEnum.CONFIRMED },
    });

    await this.walletService.depositOrWithdrawal({
      amount: +finalPrice,
      transactionDirection: 'withdrawal',
      transactionInitiator: 'user',
      user,
      description: 'خرید محصول',
      payment,
    });

    // update items and price quantity
    await this.OrderItemService.completeOrder(orderId);

    return;
  }

  async failedOrder(data: { orderId: number }) {
    const { orderId } = data;

    await this.orderRepo.update({
      filter: { id: orderId },
      updateData: { status: OrderStatusEnum.OPEN },
    });

    return;
  }

  async pendingOrder(data: { orderId: number; userId: number }) {
    const { orderId, userId } = data;

    const currentUserAddress =
      await this.userAddressService.getCurrentUserAddress(userId);

    await this.orderRepo.update({
      filter: { id: orderId },
      updateData: {
        status: OrderStatusEnum.PENDING,
        addressId: currentUserAddress?.id,
      },
    });

    return;
  }

  async getOrderHistory(
    user: UserEntity,
    status: OrderStatusEnum,
    paginationDto: PaginationDto,
  ) {
    const { limit, page } = paginationDto;
    const { document, count } = await this.orderRepo.find({
      filter: { userId: user.id, ...(status ? { status } : {}) },
      limit,
      page,
      relations: [
        'items',
        'items.product',
        'items.product.productMedia',
        'items.product.productMedia.media',
        'address',
      ],
    });

    const normalizedOrders: OrderDto[] = [];

    document.map((order) => {
      const orderDto = order.toDto() as unknown as OrderDto;
      normalizedOrders.push(orderDto);
    });

    return { orders: normalizedOrders, totalCount: count };
  }
}
