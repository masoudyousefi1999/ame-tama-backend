import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './entity/tag.entity';
import type { Repository } from 'typeorm';
import { AbstractRepository } from '../../common/abstract.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagRepository extends AbstractRepository<TagEntity> {
  constructor(
    @InjectRepository(TagEntity)
    protected tagRepo: Repository<TagEntity>,
  ) {
    super(tagRepo);
  }
}
