import './boilerplate.polyfill';

import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module.ts';
import { HttpExceptionFilter } from './filters/bad-request.filter.ts';
import { QueryFailedFilter } from './filters/query-failed.filter.ts';
import { TranslationInterceptor } from './interceptors/translation-interceptor.service.ts';
import { setupSwagger } from './setup-swagger.ts';
import { ApiConfigService } from './shared/services/api-config.service.ts';
import { TranslationService } from './shared/services/translation.service.ts';
import { SharedModule } from './shared/shared.module.ts';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  app.use(compression());
  app.use(morgan('combined'));
  app.use(cookieParser());
  app.enableVersioning();

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  let corsOrigin: string | string[] = process.env.CORS_ENV || '*';

  corsOrigin.split(',').map((value: string) => value.trim());

  if (corsOrigin.length === 1) {
    if (corsOrigin[0] === '*') {
      corsOrigin = '*';
    }
  }

  const corsOptions: cors.CorsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      if (corsOrigin.includes(origin || '') || corsOrigin === '*') {
        callback(null, true);
      } else {
        Logger.error(
          `CORS policy does not allow access from origin: ${origin}`,
        );
        callback(
          new Error(`CORS policy does not allow access from origin: ${origin}`),
        );
      }
    },
  };

  app.use((req: Request, res: Response, next: NextFunction) => {
    Logger.debug(
      `Request Origin: ${req.headers.origin},
       Method: ${req.method},
       URL: ${req.url}`,
    );
    if (req.method === 'GET') {
      return next();
    }
    cors(corsOptions)(req, res, next);
  });

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TranslationInterceptor(
      app.select(SharedModule).get(TranslationService),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  // only start nats if it is enabled
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    await app.startAllMicroservices();
  }

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;

  await app.listen(port, '0.0.0.0');
  console.info(`server running on ${await app.getUrl()}`);

  return app;
}

export const viteNodeApp = bootstrap();
