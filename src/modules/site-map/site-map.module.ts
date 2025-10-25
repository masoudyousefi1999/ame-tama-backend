import { Module } from '@nestjs/common';
import { SiteMapService } from './site-map.service';
import { SiteMapController } from './site-map.controller';
import { ProductModule } from '../../modules/product/product.module';
import { CategoryModule } from '../../modules/category/category.module';
import { TagModule } from '../../modules/tag/tag.module';
import { BlogTopicModule } from '../../modules/blog-topic/blog-topic.module';

@Module({
  imports: [ProductModule, CategoryModule, TagModule, BlogTopicModule],
  providers: [SiteMapService],
  controllers: [SiteMapController]
})
export class SiteMapModule {}
