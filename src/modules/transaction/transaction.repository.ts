import { AbstractRepository } from '../../common/abstract.repository';
import { TransactionEntity } from './entity/transaction.entity';
import type { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepository extends AbstractRepository<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity)
    transactionRepo: Repository<TransactionEntity>,
  ) {
    super(transactionRepo);
  }
}
