import { Module } from '@nestjs/common';
import { ProductDetailService } from './product-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailEntity } from './entity/product-detail.entity';
import { ProductDetailRepository } from './product-detail.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDetailEntity])],
  providers: [ProductDetailService, ProductDetailRepository],
  exports: [ProductDetailService],
})
export class ProductDetailModule {}
