import { AbstractRepository } from '../../common/abstract.repository';
import { SeoEntity } from './seo.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeoRepository extends AbstractRepository<SeoEntity> {
  constructor(
    @InjectRepository(SeoEntity)
    protected seoRepo: Repository<SeoEntity>,
  ) {
    super(seoRepo);
  }
}
