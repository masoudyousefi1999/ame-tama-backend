import { EnumField, StringField } from '../../../decorators/field.decorators';
import { VerifyPaymentStatusEnum } from '../enum/verify-payment.enum';

export class VerifyPaymentDto {
  @EnumField(() => VerifyPaymentStatusEnum)
  status!: VerifyPaymentStatusEnum;

  @StringField()
  authority!: string;
}
