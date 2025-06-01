import { ApiProperty } from '@nestjs/swagger';
import {
  PasswordField,
  PasswordFieldOptional,
} from '../../../decorators/field.decorators';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'New password', example: 'Str0ng!Pass123' })
  @PasswordField({ minLength: 6 })
  password!: string;

  @ApiProperty({
    description: 'Old password (optional)',
    example: 'OldPassword123',
    required: false,
  })
  @PasswordFieldOptional({ minLength: 6 })
  old_password?: string;
}
