import type { Repository } from 'typeorm';
import { AbstractRepository } from '../../common/abstract.repository';
import { PaymentEntity } from './entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PaymentRepository extends AbstractRepository<PaymentEntity> {
  constructor(
    @InjectRepository(PaymentEntity)
    protected PaymentRepo: Repository<PaymentEntity>,
  ) {
    super(PaymentRepo);
  }
}
