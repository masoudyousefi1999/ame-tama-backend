import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ApiConfigService } from './services/api-config.service.ts';
import { AwsS3Service } from './services/aws-s3.service.ts';
import { GeneratorService } from './services/generator.service.ts';
import { TranslationService } from './services/translation.service.ts';
import { ValidatorService } from './services/validator.service.ts';
import { REDIS_CLIENT } from '../constants/redis-client.ts';
import { connectToRedis } from '../common/utils.ts';
import { RedisService } from './services/redis.service.ts';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  AwsS3Service,
  GeneratorService,
  TranslationService,
  {
    provide: REDIS_CLIENT,
    useFactory: async (config: ApiConfigService) => {
      const { host, password, port, username } = config.redisConfigs;

      return await connectToRedis({ host, port, password, username });
    },
    inject: [ApiConfigService],
  },
  RedisService,
];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
