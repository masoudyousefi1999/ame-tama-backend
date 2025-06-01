import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderItemEntity } from './entity/order-item.entity';
import { OrderRepository } from './repository/order.repository';
import { OrderItemRepository } from './repository/order-item.repository';
import { OrderItemService } from './services/order-item.service';
import { ProductModule } from '../../modules/product/product.module';
import { WalletModule } from '../../modules/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    ProductModule,
    WalletModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderItemService,
    OrderRepository,
    OrderItemRepository,
  ],
  exports: [OrderService],
})
export class OrderModule {}
