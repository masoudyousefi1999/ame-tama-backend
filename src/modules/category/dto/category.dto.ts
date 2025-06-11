import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import { CategoryEntity } from '../entity/category.entity';

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

  @ClassFieldOptional(() => CategoryDto)
  parent?: CategoryDto;

  @ClassFieldOptional(() => CategoryDto)
  children?: CategoryDto[];

  constructor(category: CategoryEntity) {
    super(category);
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category?.description;
    this.parent = category?.parent
      ? new CategoryDto(category.parent)
      : undefined;
    this.children = category?.children
      ? category.children.map((child) => new CategoryDto(child))
      : [];
    this.image = category?.media?.url;
  }
}
