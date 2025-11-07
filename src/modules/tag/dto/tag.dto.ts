import { MediaDto } from '../../../modules/media/dtos/media.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import type { TagEntity } from '../entity/tag.entity';
import type { CategoryDto } from '../../category/dto/category.dto';
import type { ProductDto } from 'modules/product/dto/product.dto';
import { SeoDto } from '../../seo/dto/seo.dto';

export class TagDto extends AbstractDto {
  @StringField()
  name!: string;

  @StringField()
  slug!: string;

  @StringFieldOptional()
  description?: string;

  @ClassFieldOptional(() => MediaDto)
  image?: MediaDto;

  categories?: CategoryDto[];

  products?: ProductDto[];

  @ClassFieldOptional(() => SeoDto)
  seoMetadata?: SeoDto;

  constructor(tag: TagEntity) {
    super(tag as any);
    this.name = tag.name;
    this.slug = tag.slug;
    this.description = tag.description;
    this.image = tag.image ? new MediaDto(tag.image) : undefined;
    this.products = tag.products as any;
    this.categories = tag.categories as any;
    this.seoMetadata = tag.seoMetadata ? new SeoDto(tag.seoMetadata) : undefined;
  }
}
