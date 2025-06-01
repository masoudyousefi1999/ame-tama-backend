import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../../common/abstract.repository';
import { OrderItemEntity } from '../entity/order-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

@Injectable()
export class OrderItemRepository extends AbstractRepository<OrderItemEntity> {
  constructor(
    @InjectRepository(OrderItemEntity)
    protected orderItemRepository: Repository<OrderItemEntity>,
  ) {
    super(orderItemRepository);
  }
}
