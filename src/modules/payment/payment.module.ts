import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { PaymentRepository } from './payment.repository';
import { OrderModule } from '../../modules/order/order.module';
import { WalletModule } from '../../modules/wallet/wallet.module';
import { TransactionModule } from '../../modules/transaction/transaction.module';
import { ProductModule } from '../../modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    OrderModule,
    WalletModule,
    TransactionModule,
    ProductModule,
  ],
  providers: [PaymentService, PaymentRepository],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
