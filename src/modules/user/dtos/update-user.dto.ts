import {
  EmailFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';

export class UpdateUserDto {
  @StringFieldOptional()
  firstName?: string;

  @StringFieldOptional()
  lastName?: string;

  @EmailFieldOptional()
  email?: string;

  @UUIDFieldOptional()
  avatar?: Uuid;
}
