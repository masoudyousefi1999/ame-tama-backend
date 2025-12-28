import { ArtWorkEntity } from '../entity/art-work.entity';
import { AbstractRepository } from '../../../common/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArtWorkRepository extends AbstractRepository<ArtWorkEntity> {
  constructor(
    @InjectRepository(ArtWorkEntity)
    protected artWorkRepo: Repository<ArtWorkEntity>,
  ) {
    super(artWorkRepo);
  }
}
