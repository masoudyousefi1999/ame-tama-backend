import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { CategoryRepository } from './category.repository';
import { MediaModule } from '../../modules/media/media.module';
import { ProductModule } from '../../modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    MediaModule,
    ProductModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
