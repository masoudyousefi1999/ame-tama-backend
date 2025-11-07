import { forwardRef, Module } from '@nestjs/common';
import { BlogTopicService } from './blog-topic.service';
import { BlogTopicController } from './blog-topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogTopicEntity } from './blog-topic.entity';
import { BlogTopicRepository } from './blog-topic.repository';
import { MediaModule } from '../media/media.module';
import { BlogModule } from '../blog/blog.module';
import { SeoModule } from '../seo/seo.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogTopicEntity]), MediaModule, forwardRef(() => BlogModule), SeoModule],
  providers: [BlogTopicService, BlogTopicRepository],
  controllers: [BlogTopicController],
  exports: [BlogTopicService],
})
export class BlogTopicModule {}
