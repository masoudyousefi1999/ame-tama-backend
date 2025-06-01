import { ApiProperty } from '@nestjs/swagger';
import {
  ClassField,
  ClassFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../../../decorators/field.decorators';

export class CustomFieldDto {
  @ApiProperty({ example: 'key name' })
  @StringField()
  key!: string;

  @ApiProperty({ example: 'key value' })
  @StringField()
  value!: string;
}

class CreateProductDetailDto {
  @StringField()
  series!: string;

  @StringField()
  character!: string;

  @StringFieldOptional()
  description?: string;

  @ApiProperty({ required: true, example: '[{key: "", value: ""}, ...]' })
  @ClassFieldOptional(() => CustomFieldDto, { each: true })
  specifications?: CustomFieldDto[];
}

export class CreateProductDto {
  @ApiProperty({ type: 'string', default: 'product name' })
  @StringField()
  name!: string;

  @ApiProperty({ type: 'string', default: 'product-slug' })
  @StringField()
  slug!: string;

  @ApiProperty({ type: 'number', default: 100_000 })
  @NumberField()
  price!: number;

  @ApiProperty({ type: 'number', default: 100 })
  @NumberField()
  quantity!: number;

  @ApiProperty({ type: 'number', default: 5 })
  @NumberField()
  rating!: number;

  @ApiProperty({ type: 'string' })
  @UUIDField()
  category!: Uuid;

  @ClassField(() => CreateProductDetailDto)
  productDetail!: CreateProductDetailDto;
}
