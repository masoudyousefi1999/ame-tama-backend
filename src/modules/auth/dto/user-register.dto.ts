import {
  PasswordFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class UserRegisterDto {
  @PasswordFieldOptional({ minLength: 6 })
  password?: string;

  @StringFieldOptional()
  phone?: string;

  @StringFieldOptional()
  otp?: string;

  @StringFieldOptional()
  email?: string;
}
