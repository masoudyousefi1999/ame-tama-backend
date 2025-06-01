import { AbstractRepository } from '../../common/abstract.repository';
import { CategoryEntity } from './entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    protected categoryRepo: Repository<CategoryEntity>,
  ) {
    super(categoryRepo);
  }
}
