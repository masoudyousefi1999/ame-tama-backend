import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../../common/abstract.repository';
import { OrderEntity } from '../entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    protected orderRepository: Repository<OrderEntity>,
  ) {
    super(orderRepository);
  }
}
