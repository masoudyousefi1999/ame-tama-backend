import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { AbstractRepository } from '../../../common/abstract.repository';
import { Injectable } from '@nestjs/common';
import { ShippingMethodEntity } from '../shipping-method.entity';

@Injectable()
export class ShippingMethodRepository extends AbstractRepository<ShippingMethodEntity> {
  constructor(
    @InjectRepository(ShippingMethodEntity)
    protected shippingMethodRepo: Repository<ShippingMethodEntity>,
  ) {
    super(shippingMethodRepo);
  }
}
