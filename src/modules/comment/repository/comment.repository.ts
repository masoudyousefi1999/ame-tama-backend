import { AbstractRepository } from '../../../common/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommentEntity } from '../entity/comment.entity';

@Injectable()
export class CommentRepository extends AbstractRepository<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity)
    protected productRepo: Repository<CommentEntity>,
  ) {
    super(productRepo);
  }
}
