import { Module } from '@nestjs/common';
import { RssService } from './rss.service';
import { RssController } from './rss.controller';
import { RssEntity } from './rss.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogTopicModule } from '../blog-topic/blog-topic.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([RssEntity]), BlogModule, BlogTopicModule],
  providers: [RssService],
  controllers: [RssController],
})
export class RssModule {}
