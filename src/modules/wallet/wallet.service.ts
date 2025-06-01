import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from './repository/wallet.repository';
import { WalletTransactionRepository } from './repository/wallet-transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import type { UserEntity } from 'modules/user/user.entity';
import type { WalletEntity } from './entity/wallet.entity';
import type { WalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    private walletRepo: WalletRepository,
    private walletTransactionRepo: WalletTransactionRepository,
  ) {}

  async depositOrWithdrawal(
    createTransactionDto: CreateTransactionDto,
  ): Promise<WalletDto> {
    const {
      amount,
      transactionInitiator,
      user,
      description,
      payment,
      transactionDirection,
    } = createTransactionDto;

    if (!user) {
      throw new NotFoundException('user not founded');
    }

    const userWallet = await this.findOne(user);

    await this.walletTransactionRepo.create({
      amount,
      description,
      transactionDirection,
      transactionInitiator,
      walletId: userWallet.id,
      paymentId: payment.id,
    });

    const wallet = await this.findOne(user);
    wallet.user = user;

    return wallet.toDto() as WalletDto;
  }

  async findOne(user: UserEntity): Promise<WalletEntity> {
    if (!user) throw new NotFoundException('user not founded');

    let userWallet = await this.walletRepo.findOne({
      filter: { userId: user.id },
    });

    if (!userWallet) {
      userWallet = await this.walletRepo.create({
        balance: 0,
        userId: user.id,
      });
    }

    return userWallet;
  }
}
