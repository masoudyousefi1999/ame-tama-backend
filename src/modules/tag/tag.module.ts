import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagEntity } from './entity/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './tag.repository';
import { MediaModule } from '../media/media.module';
import { CategoryModule } from '../category/category.module';
import { ProductTagEntity } from './entity/product-tag.entity';
import { ProductModule } from '../../modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagEntity, ProductTagEntity]),
    MediaModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [TagService, TagRepository],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
