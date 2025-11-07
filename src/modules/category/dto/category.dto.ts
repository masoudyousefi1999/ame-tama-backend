import { TagDto } from '../../../modules/tag/dto/tag.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import { CategoryEntity } from '../entity/category.entity';
import { SeoDto } from '../../seo/dto/seo.dto';

export class CategoryDto extends AbstractDto {
  @NumberField()
  id!: number;

  @StringField()
  name!: string;

  @StringField()
  slug!: string;

  @StringFieldOptional()
  description?: string;

  @StringFieldOptional()
  image?: string;

  @ClassFieldOptional(() => TagDto)
  tags?: TagDto[];

  @ClassFieldOptional(() => SeoDto)
  seoMetadata?: SeoDto;

  constructor(category: CategoryEntity) {
    super(category);
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category?.description;
    this.image = category?.media?.url;
    this.tags = category?.tags?.map((tag) => new TagDto(tag)) || [];
    this.seoMetadata = category?.seoMetadata ? new SeoDto(category.seoMetadata) : undefined;
  }
}
