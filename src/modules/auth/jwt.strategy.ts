import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenType } from '../../constants/token-type.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import type { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.cookies[TokenType.ACCESS_TOKEN]) {
            return req.cookies[TokenType.ACCESS_TOKEN];
          }
          return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: { userId: Uuid; type: TokenType }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      console.log('user type is not access token => ', args.type);
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(
      {
        uuid: args.userId,
      },
      
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
