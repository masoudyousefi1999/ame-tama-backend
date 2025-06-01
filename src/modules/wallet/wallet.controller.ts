import { Controller, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Auth } from '../../decorators/http.decorators';
import { AuthUser } from '../../decorators/auth-user.decorator';
import type { UserEntity } from '../../modules/user/user.entity';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @Auth([])
  async getUserWallet(@AuthUser() user: UserEntity) {
    const wallet = await this.walletService.findOne(user);
    wallet.user = user;
    return wallet.toDto();
  }
}
