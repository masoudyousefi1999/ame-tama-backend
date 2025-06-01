import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import type { CategoryEntity } from '../entity/category.entity';

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

  constructor(category: CategoryEntity) {
    super(category);
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category?.description;
    this.image = category?.media?.url;
  }
}
