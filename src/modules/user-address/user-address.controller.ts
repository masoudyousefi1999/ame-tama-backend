import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import type { UserEntity } from '../../modules/user/user.entity';
import { CreateUserAddressDto } from './dto/create-address.dto';
import { Auth } from '../../decorators/http.decorators';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { UserAddressDto } from './dto/user-address.dto';

@Controller('address')
export class UserAddressController {
  constructor(private userAddressService: UserAddressService) {}

  @Auth([])
  @Post()
  @ApiOkResponse({
    type: UserAddressDto,
  })
  async createAddress(
    @AuthUser() user: UserEntity,
    @Body() createUserAddressDto: CreateUserAddressDto,
  ) {
    return await this.userAddressService.createAddress(
      user,
      createUserAddressDto,
    );
  }

  @Auth([])
  @Get()
  @ApiOkResponse({
    type: [UserAddressDto],
  })
  async getAddresses(@AuthUser() user: UserEntity) {
    return await this.userAddressService.getAddresses(user);
  }

  @Get('/province')
  async getProvinces() {
    return await this.userAddressService.getProvince();
  }

  @Get('/city')
  async getCities() {
    return await this.userAddressService.getCities();
  }

  @Auth([])
  @Get('/default')
  @ApiOkResponse({
    type: [UserAddressDto],
  })
  async getDefaultAddress(@AuthUser() user: UserEntity) {
    return await this.userAddressService.getCurrentUserAddress(user.id);
  }

  @Auth([])
  @Post('/default/:addressId')
  @ApiParam({ name: 'addressId', type: 'string', required: true })
  @ApiOkResponse({
    type: [UserAddressDto],
  })
  async makeAddressDefault(
    @AuthUser() user: UserEntity,
    @Param('addressId', new ParseUUIDPipe()) addressId: Uuid,
  ) {
    return await this.userAddressService.makeDefaultAddress(addressId, user);
  }

  @Auth([])
  @Get(':addressId')
  @ApiParam({ name: 'addressId', type: 'string', required: true })
  @ApiOkResponse({
    type: [UserAddressDto],
  })
  async getAddress(
    @AuthUser() user: UserEntity,
    @Param('addressId', new ParseUUIDPipe()) addressId: Uuid,
  ) {
    return await this.userAddressService.getAddress(addressId, user);
  }
}
