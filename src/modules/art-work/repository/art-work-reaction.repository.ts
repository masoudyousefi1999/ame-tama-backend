import { AbstractRepository } from '../../../common/abstract.repository';
import { ArtWorkReactionEntity } from '../entity/art-work-reaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArtWorkReactionRepository extends AbstractRepository<ArtWorkReactionEntity> {
  constructor(
    @InjectRepository(ArtWorkReactionEntity)
    protected artWorkReactionRepo: Repository<ArtWorkReactionEntity>,
  ) {
    super(artWorkReactionRepo);
  }
}
