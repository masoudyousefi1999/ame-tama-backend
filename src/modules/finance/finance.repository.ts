import { AbstractRepository } from '../../common/abstract.repository';
import { FinanceEntity } from './finance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

export class FinanceRepository extends AbstractRepository<FinanceEntity> {
  constructor(
    @InjectRepository(FinanceEntity)
    protected financeRepo: Repository<FinanceEntity>,
  ) {
    super(financeRepo);
  }
}
