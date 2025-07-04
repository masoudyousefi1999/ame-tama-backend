import { UserAddressDto } from '../../../modules/user-address/dto/user-address.dto.ts';
import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { RoleType } from '../../../constants/role-type.ts';
import {
  ClassFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import type { UserEntity } from '../user.entity.ts';

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @StringFieldOptional({ nullable: true })
  phone?: string | null;

  @ClassFieldOptional(() => UserAddressDto)
  addresses?: UserAddressDto[];

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.phone = user.phone;
    this.avatar = user?.media?.url;
    this.addresses = user?.addresses?.length
      ? user.addresses.map((i) => new UserAddressDto(i))
      : [];
  }
}
