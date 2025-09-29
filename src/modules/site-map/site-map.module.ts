import { Module } from '@nestjs/common';
import { SiteMapService } from './site-map.service';
import { SiteMapController } from './site-map.controller';
import { ProductModule } from '../../modules/product/product.module';
import { CategoryModule } from '../../modules/category/category.module';

@Module({
  imports: [ProductModule, CategoryModule],
  providers: [SiteMapService],
  controllers: [SiteMapController]
})
export class SiteMapModule {}
