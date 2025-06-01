import { AbstractRepository } from '../../../common/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { WalletEntity } from '../entity/wallet.entity';

@Injectable()
export class WalletRepository extends AbstractRepository<WalletEntity> {
  constructor(
    @InjectRepository(WalletEntity)
    protected walletRepo: Repository<WalletEntity>,
  ) {
    super(walletRepo);
  }
}
