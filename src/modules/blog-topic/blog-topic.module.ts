import { Module } from '@nestjs/common';
import { BlogTopicService } from './blog-topic.service';
import { BlogTopicController } from './blog-topic.controller';

@Module({
  providers: [BlogTopicService],
  controllers: [BlogTopicController]
})
export class BlogTopicModule {}
