import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductRepository } from './repository/product.repository';
import { CategoryModule } from '../../modules/category/category.module';
import { ProductMediaRepository } from './repository/product-media.repository';
import { ProductMediaEntity } from './entity/product-media.entity';
import { MediaModule } from '../../modules/media/media.module';
import { ProductDetailModule } from '../../modules/product-detail/product-detail.module';
import { SeoModule } from '../seo/seo.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductMediaEntity]),
    forwardRef(() => CategoryModule),
    MediaModule,
    ProductDetailModule,
    SeoModule,
    TagModule,
  ],
  providers: [ProductService, ProductRepository, ProductMediaRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
