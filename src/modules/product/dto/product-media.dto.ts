import {
  BooleanFieldOptional,
  NumberField,
  StringField,
} from '../../../decorators/field.decorators';

import { ProductMediaEntity } from '../entity/product-media.entity';

export class ProductMediaDto {
  @NumberField()
  order!: number;

  @BooleanFieldOptional()
  isDefault!: boolean;

  @StringField()
  url!: string;

  constructor(entity: ProductMediaEntity) {
    this.order = entity.order;
    this.isDefault = entity.isDefault;
    this.url = entity?.media?.url || '';
  }
}
