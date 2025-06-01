import { StringField, StringFieldOptional } from '../../../decorators/field.decorators';

export class ProductDetailDto {
  @StringField()
  series!: string;

  @StringField()
  character!: string;

  @StringFieldOptional()
  description?: string;

  specifications?: Record<string, any>;

  constructor(entity: ProductDetailDto) {
    this.series = entity.series;
    this.character = entity.character;
    this.description = entity.description;
    this.specifications = entity.specifications;
  }
}
