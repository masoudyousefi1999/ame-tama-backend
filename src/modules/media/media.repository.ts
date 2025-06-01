import { AbstractRepository } from '../../common/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MediaEntity } from './media.entity';

@Injectable()
export class MediaRepository extends AbstractRepository<MediaEntity> {
  constructor(
    @InjectRepository(MediaEntity)
    protected readonly mediaRepo: Repository<MediaEntity>,
  ) {
    super(mediaRepo);
  }
}
