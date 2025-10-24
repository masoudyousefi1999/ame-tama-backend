import { BlogEntity } from './blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../common/abstract.repository';

@Injectable()
export class BlogRepository extends AbstractRepository<BlogEntity> {
  constructor(
    @InjectRepository(BlogEntity)
    protected blogRepo: Repository<BlogEntity>,
  ) {
    super(blogRepo);
  }
}
