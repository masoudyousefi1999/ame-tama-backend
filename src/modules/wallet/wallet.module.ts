import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletTransactionRepository } from './repository/wallet-transaction.repository';
import { WalletRepository } from './repository/wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { WalletTransactionEntity } from './entity/wallet-transaction.entity';
import { UserModule } from '../../modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity, WalletTransactionEntity]),
    UserModule,
  ],
  providers: [WalletService, WalletRepository, WalletTransactionRepository],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
