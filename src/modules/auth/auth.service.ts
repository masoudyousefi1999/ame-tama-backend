import { OtpRepository } from './otp.repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateOtp, sendSms, validateHash } from '../../common/utils.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import { UserService } from '../user/user.service.ts';
import { TokenPayloadDto } from './dto/token-payload.dto.ts';
import type { UserRegisterDto } from './dto/user-register.dto.ts';
import type { Response } from 'express';
import type { SendOtpDto } from './dto/send-otp.dto.ts';
import { RedisService } from '../../shared/services/redis.service.ts';
import type { OtpEntity } from './otp.entity.ts';
import { TokenType } from '../../constants/token-type.ts';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
    private otpRepository: OtpRepository,
    private redisService: RedisService,
  ) {}

  setCookie(res: Response, name: string, value: string, maxAge: number) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: true,
      maxAge,
      sameSite: 'none',
    });
  }

  async createAccessToken(data: {
    userId: Uuid;
    type: TokenType;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: data.type,
      }),
    });
  }

  async validateUser(
    userPassword: string | null,
    password: string | null,
  ): Promise<Boolean> {
    if (!userPassword || !password) {
      return false;
    }
    const isPasswordValid = await validateHash(password, userPassword);

    if (!isPasswordValid) {
      return false;
    }

    return true;
  }

  async registerUser(data: {
    userRegisterDto: UserRegisterDto;
    res: Response;
    provider?: 'ame-tama' | 'finance';
  }): Promise<any> {
    const { userRegisterDto, res, provider } = data;
    const { password, phone, otp, email } = userRegisterDto;

    let tokenType = TokenType.ACCESS_TOKEN;

    if (provider && provider === 'finance') {
      tokenType = TokenType.FINANCE_TOKEN;
    } else {
      tokenType = TokenType.ACCESS_TOKEN;
    }

    if (!password && !phone && !otp && !email) {
      throw new BadRequestException(
        'at least one combination required for register',
      );
    }

    const condition = phone ? { phone } : { email };

    const isUserExist = await this.userService.findOne(condition);

    const method = phone ? 'otp' : 'email';

    if (isUserExist && method === 'email') {
      if (!password) {
        throw new BadRequestException(
          'please provide password when you want to login with email..',
        );
      }

      const isPasswordValid = await this.validateUser(
        isUserExist?.password,
        password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('username or password is incorrect');
      }

      const token = await this.createAccessToken({
        userId: isUserExist.uuid!,
        type: tokenType,
      });

      this.setCookie(
        res,
        tokenType,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      res.json({ user: isUserExist, token });
      return;
    } else if (isUserExist && method === 'otp' && !password) {
      const isOtpValid = await this.validateOtp(isUserExist.phone!, otp!);

      if (!isOtpValid) {
        throw new UnprocessableEntityException('otp is not valid...');
      }

      const token = await this.createAccessToken({
        userId: isUserExist.uuid!,
        type: tokenType,
      });

      this.setCookie(
        res,
        tokenType,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      res.json({ user: isUserExist, token });
      return;
    } else if (isUserExist && method === 'otp' && password) {
      if (!password) {
        throw new BadRequestException(
          'please provide password when you want to login with email..',
        );
      }

      const isPasswordValid = await this.validateUser(
        isUserExist?.password,
        password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('username or password is incorrect');
      }

      const token = await this.createAccessToken({
        userId: isUserExist.uuid!,
        type: tokenType,
      });

      this.setCookie(
        res,
        tokenType,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      res.json({ user: isUserExist, token });
      return;
    } else if (!isUserExist && method === 'otp') {
      const user = await this.userService.createUser({ phone: phone! });

      const isOtpValid = await this.validateOtp(phone!, otp!);

      if (!isOtpValid) {
        throw new UnprocessableEntityException('otp is not valid...');
      }

      const token = await this.createAccessToken({
        userId: user.uuid!,
        type: tokenType,
      });

      this.setCookie(
        res,
        tokenType,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      res.json({ user, token });
      return;
    }

    throw new UnauthorizedException('email or password is not correct..');
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    try {
      const { phone } = sendOtpDto;
      const otpCode = generateOtp(4);

      let isSmsSended = null;

      try {
        isSmsSended = await sendSms(phone, otpCode);
        if (!isSmsSended?.data) {
          throw new InternalServerErrorException(isSmsSended);
        }
      } catch (error) {
        console.log(error);
        isSmsSended = null;
      }

      if (!isSmsSended) {
        return false;
      }

      const isCached = await this.redisService.cacheData(phone, otpCode, 120); // 2 minutes

      if (!isCached) {
        const isOtpExist = await this.otpRepository.findOne({
          filter: { phone },
        });

        if (isOtpExist) {
          await this.otpRepository.delete({ phone });
        }

        await this.otpRepository.create({ otpCode: otpCode, phone });
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  async validateOtp(phone: string, otp: string): Promise<boolean> {
    if (!phone || !otp) {
      return false;
    }

    const cachedData = await this.redisService.getCachedData(phone);

    // maybe redis is not reachable check in pg database as fallback
    if (!cachedData) {
      const userOtp = await this.otpRepository.findOne({ filter: { phone } });

      if (userOtp) {
        const isOtpStillValid = this.isOtpStillValid(userOtp);

        if (isOtpStillValid) {
          await this.otpRepository.delete({ phone });
          return true;
        }
      }

      return false;
    }

    const isOtpValid = otp === cachedData;

    if (isOtpValid) {
      this.redisService.deleteCachedData(phone);
      return true;
    }

    return false;
  }

  isOtpStillValid(otp: OtpEntity): boolean {
    const timeDifference = new Date().getTime() - otp.createdAt.getTime();
    const isValidOtp = timeDifference < 2 * 60 * 1000;

    if (!isValidOtp) {
      return false;
    }

    return true;
  }

  logout(res: Response) {
    this.setCookie(res, TokenType.ACCESS_TOKEN, '', 0);
    res.end();
    return;
  }
}
