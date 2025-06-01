import { ApiProperty } from '@nestjs/swagger';
import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';

export class CreateUserAddressDto {
  @ApiProperty({ name: 'province', required: true })
  @StringField()
  province!: string;

  @ApiProperty({ name: 'city', required: true })
  @StringField()
  city!: string;

  @ApiProperty({ name: 'address', required: true })
  @StringField()
  address!: string;

  @ApiProperty({ name: 'postalCode', required: true })
  @StringField()
  postalCode!: string;

  @ApiProperty({ name: 'houseNumber', required: false })
  @StringFieldOptional()
  houseNumber?: string;

  @ApiProperty({ name: 'floorNumber', required: false })
  @StringFieldOptional()
  floorNumber?: string;
}
