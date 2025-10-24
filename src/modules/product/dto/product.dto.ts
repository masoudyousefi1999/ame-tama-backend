import {
  ClassFieldOptional,
  NumberField,
  StringField,
} from '../../../decorators/field.decorators';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CategoryDto } from '../../../modules/category/dto/category.dto';
import type { ProductEntity } from '../entity/product.entity';
import { ProductMediaDto } from './product-media.dto';
import { ProductDetailDto } from '../../../modules/product-detail/dto/product-detail.dto';
import { TagDto } from '../../../modules/tag/dto/tag.dto';
export class ProductDto extends AbstractDto {
  @StringField()
  name!: string;

  @StringField()
  slug!: string;

  @NumberField()
  price!: number;

  @NumberField()
  quantity!: number;

  @NumberField()
  rating!: number;

  @ClassFieldOptional(() => ProductDetailDto)
  detail?: ProductDetailDto;

  @ClassFieldOptional(() => CategoryDto)
  category?: CategoryDto;

  @ClassFieldOptional(() => ProductMediaDto, { each: true })
  productMedia?: ProductMediaDto[];

  @ClassFieldOptional(() => TagDto, { each: true })
  tags?: TagDto[];

  constructor(product: ProductEntity) {
    super(product);
    this.name = product.name;
    this.slug = product.slug;
    this.price = Number(product.price);
    this.quantity = Number(product.quantity);
    this.rating = product.rating !== undefined ? Number(product.rating) : 0;
    this.detail = product?.detail
      ? new ProductDetailDto(product.detail)
      : undefined;
    this.category = product?.category
      ? new CategoryDto(product.category)
      : undefined;
    this.productMedia = product?.productMedia
      ? product?.productMedia.map((item) => new ProductMediaDto(item))
      : [];
    this.tags = product?.tags
      ? product?.tags.map((item) => new TagDto(item))
      : [];
  }
}
