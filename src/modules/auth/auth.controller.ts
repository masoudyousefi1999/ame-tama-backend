import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
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
import type { Response, Request } from 'express';
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
    @Req() req: Request,
  ) {
    let provider = (req?.headers?.providerSite as string) || 'ame-tama';

    if (provider !== 'finance' && provider !== 'ame-tama') {
      provider = 'ame-tama';
    }

    if (!provider) {
      provider = 'ame-tama';
    }

    return await this.authService.registerUser({
      userRegisterDto,
      res,
      provider: (provider! as 'ame-tama') || 'finance',
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Successfully logout' })
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
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
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: Boolean })
  isAdmin(@AuthUser() user: UserEntity): boolean {
    return user?.role === 'ADMIN';
  }

  @Get('site-info')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({ type: Object })
  async getSiteInfo() {
    try {
        return await this.authService.getSiteInfo();
    } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Failed to get site info');
    }
  }
}
