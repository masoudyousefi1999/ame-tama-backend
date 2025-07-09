import { ApiProperty } from '@nestjs/swagger';
import { StringField } from '../../../decorators/field.decorators';

export class SendChatDto {
  @StringField()
  @ApiProperty({ name: 'message', required: true })
  message!: string;
}
