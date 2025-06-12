import { OtpRepository } from './otp.repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  generateHash,
  generateOtp,
  sendSms,
  validateHash,
} from '../../common/utils.ts';
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

  async registerUser(
    userRegisterDto: UserRegisterDto,
    res: Response,
  ): Promise<any> {
    const { password, phone, otp, email } = userRegisterDto;

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
        type: TokenType.ACCESS_TOKEN,
      });

      this.setCookie(
        res,
        TokenType.ACCESS_TOKEN,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      return res.json({ user: isUserExist, token });
    } else if (isUserExist && method === 'otp' && !password) {
      const isOtpValid = await this.validateOtp(isUserExist.phone!, otp!);

      if (!isOtpValid) {
        throw new UnprocessableEntityException('otp is not valid...');
      }

      const token = await this.createAccessToken({
        userId: isUserExist.uuid!,
        type: TokenType.ACCESS_TOKEN,
      });

      this.setCookie(
        res,
        TokenType.ACCESS_TOKEN,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      return res.json({ user: isUserExist, token });
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
        type: TokenType.ACCESS_TOKEN,
      });

      this.setCookie(
        res,
        TokenType.ACCESS_TOKEN,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      return res.json({ user: isUserExist, token });
    } else if (!isUserExist && method === 'otp') {
      const user = await this.userService.createUser({ phone: phone! });

      const isOtpValid = await this.validateOtp(phone!, otp!);

      if (!isOtpValid) {
        throw new UnprocessableEntityException('otp is not valid...');
      }

      const token = await this.createAccessToken({
        userId: user.uuid!,
        type: TokenType.ACCESS_TOKEN,
      });

      this.setCookie(
        res,
        TokenType.ACCESS_TOKEN,
        token.accessToken,
        1000 * 60 * 60 * 24 * 30,
      );

      return res.json({ user: isUserExist, token });
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
        console.log('is sms send => ', isSmsSended);
      } catch (error) {
        console.log(error);
        isSmsSended = null;
      }

      if (!isSmsSended) {
        return false;
      }

      const hashedOtp = generateHash(otpCode);

      console.log('data cached to redis => ', phone, ' ', hashedOtp);
      const isCached = await this.redisService.cacheData(phone, hashedOtp, 120); // 2 minutes

      if (!isCached) {
        console.log('no redis founded hashing in db');
        const isOtpExist = await this.otpRepository.findOne({
          filter: { phone },
        });

        if (isOtpExist) {
          await this.otpRepository.delete({ phone });
        }

        await this.otpRepository.create({ otpCode: hashedOtp, phone });
      }

      console.log('everithing is okey and returning true ');
      return true;
    } catch (err) {
      console.dir({ message: 'error on sending otp : ', err }, { depth: null });
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
        const otpCOde = await validateHash(otp, userOtp.otpCode);

        const isOtpStillValid = this.isOtpStillValid(userOtp);

        if (otpCOde && isOtpStillValid) {
          await this.otpRepository.delete({ phone });
          return true;
        }
      }

      return false;
    }

    const isOtpValid = await validateHash(otp, cachedData);

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
}
