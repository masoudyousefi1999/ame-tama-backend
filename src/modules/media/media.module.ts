import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaRepository } from './media.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  providers: [MediaService, MediaRepository],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
