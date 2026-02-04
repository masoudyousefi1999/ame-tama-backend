import {
  EmailFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';

export class UpdateUserDto {
  @StringFieldOptional()
  first_name?: string;

  @StringFieldOptional()
  last_name?: string;

  @EmailFieldOptional()
  email?: string;

  @UUIDFieldOptional()
  avatar?: Uuid;
}
