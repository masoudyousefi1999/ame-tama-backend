import { forwardRef, Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { BlogController } from './blog.controller';
import { MediaModule } from '../../modules/media/media.module';
import { BlogTopicModule } from '../../modules/blog-topic/blog-topic.module';
import { AiModule } from '../ai/ai.module';
import { SeoModule } from '../seo/seo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    MediaModule,
    forwardRef(() => BlogTopicModule),
    AiModule,
    SeoModule,
  ],
  providers: [BlogService, BlogRepository],
  controllers: [BlogController],
  exports: [BlogService,BlogRepository],
})
export class BlogModule {}
