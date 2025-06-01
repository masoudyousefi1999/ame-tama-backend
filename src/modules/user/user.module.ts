import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller.ts';
import { UserEntity } from './user.entity.ts';
import { UserService } from './user.service.ts';
import { UserRepository } from './user.repository.ts';
import { MediaModule } from '../../modules/media/media.module.ts';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),MediaModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserRepository],
})
export class UserModule {}
