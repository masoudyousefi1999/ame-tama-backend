import {
  ClassFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserDto } from '../../../modules/user/dtos/user.dto';
import type { UserAddressEntity } from '../entity/user-address.entity';

export class UserAddressDto extends AbstractDto {
  @StringField()
  province!: string;

  @StringField()
  city!: string;

  @StringField()
  address!: string;

  @StringField()
  postalCode!: string;

  @StringFieldOptional()
  houseNumber?: string;

  @StringFieldOptional()
  floorNumber?: string;

  @ClassFieldOptional(() => UserDto)
  user?: UserDto;

  constructor(entity: UserAddressEntity) {
    super(entity);
    this.province = entity.province;
    this.city = entity.city;
    this.address = entity.address;
    this.postalCode = entity.postalCode;
    this.houseNumber = entity.houseNumber;
    this.floorNumber = entity.floorNumber;
    this.user = entity.user ? new UserDto(entity.user) : undefined;
  }
}
