import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { UserDto } from './dtos/user.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from './user.entity';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RoleType } from '../../constants/role-type';
import type { PaginationDto } from 'common/dto/pagination.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('password')
  @Auth([])
  @ApiOkResponse({
    type: UserDto,
    description: 'update current user',
  })
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @AuthUser() user: UserEntity,
    @Body() updateUserDto: UpdatePasswordDto,
  ): Promise<UserDto> {
    return await this.userService.updatePassword(user, updateUserDto);
  }

  @Patch('update')
  @Auth([])
  @ApiOkResponse({
    type: UserDto,
    description: 'update current user',
  })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @AuthUser() user: UserEntity,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user, UpdateUserDto);
  }

  @Get()
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({
    type: [UserDto],
  })
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() paginationDto: PaginationDto) {
    return await this.userService.getUsers(paginationDto);
  }
}
