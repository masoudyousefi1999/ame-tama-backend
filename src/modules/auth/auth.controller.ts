import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { UserDto } from '../user/dtos/user.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { AuthService } from './auth.service.ts';
import { UserRegisterDto } from './dto/user-register.dto.ts';
import type { Response } from 'express';
import { SendOtpDto } from './dto/send-otp.dto.ts';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @Res() res: Response,
  ) {
    return await this.authService.registerUser(userRegisterDto, res);
  }

  @Post('otp')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await this.authService.sendOtp(sendOtpDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }

  @Post('is-admin')
  @HttpCode(HttpStatus.OK)
  @Auth([])
  @ApiOkResponse({ type: Boolean })
  isAdmin(@AuthUser() user: UserEntity): boolean {
    return user?.role === 'ADMIN';
  }
}
