import { ApiProperty } from '@nestjs/swagger';
import { StringField } from '../../../decorators/field.decorators';

export class SendOtpDto {
  @ApiProperty({ type: 'string', description: 'phone number for sending otp' })
  @StringField()
  phone!: string;
}
