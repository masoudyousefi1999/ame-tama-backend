import { AuthUser } from '../../decorators/auth-user.decorator';
import { PaymentService } from './payment.service';
import { Body, Controller, Post } from '@nestjs/common';
import type { UserEntity } from '../../modules/user/user.entity';
import { Auth } from '../../decorators/http.decorators';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Auth([])
  @Post()
  async startPayment(@AuthUser() user: UserEntity) {
    return await this.paymentService.create(user);
  }

  @Auth([])
  @Post('/verify')
  async verifyPayment(
    @AuthUser() user: UserEntity,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return await this.paymentService.verifyPayment(user, verifyPaymentDto);
  }
}
