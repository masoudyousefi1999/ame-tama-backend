import { PartialType } from '@nestjs/swagger';
import { CreateUserAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateUserAddressDto) {}
