import { AbstractRepository } from '../../../common/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { WalletTransactionEntity } from '../entity/wallet-transaction.entity';

@Injectable()
export class WalletTransactionRepository extends AbstractRepository<WalletTransactionEntity> {
  constructor(
    @InjectRepository(WalletTransactionEntity)
    protected walletTransactionRepo: Repository<WalletTransactionEntity>,
  ) {
    super(walletTransactionRepo);
  }
}
