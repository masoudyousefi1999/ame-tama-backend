import { AbstractRepository } from '../../common/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BlogTopicEntity } from './blog-topic.entity';

@Injectable()
export class BlogTopicRepository extends AbstractRepository<BlogTopicEntity> {
  constructor(
    @InjectRepository(BlogTopicEntity)
    protected blogTopicRepository: Repository<BlogTopicEntity>,
  ) {
    super(blogTopicRepository);
  }
}
