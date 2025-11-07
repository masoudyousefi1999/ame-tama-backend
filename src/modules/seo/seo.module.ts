import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoEntity } from './seo.entity';
import { SeoRepository } from './seo.repository';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeoEntity]), MediaModule],
  providers: [SeoService, SeoRepository],
  controllers: [SeoController],
  exports: [SeoService],
})
export class SeoModule {}
