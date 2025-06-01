import { ApiProperty } from '@nestjs/swagger';
import {
  StringField,
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';

export class CreateCategoryDto {
  @ApiProperty({ name: 'name', required: true })
  @StringField()
  name!: string;

  @ApiProperty({ name: 'slug', required: true })
  @StringField()
  slug!: string;

  @ApiProperty({ name: 'description', required: false })
  @StringFieldOptional()
  description?: string;

  @ApiProperty({ name: 'image', required: false })
  @UUIDFieldOptional()
  image?: Uuid;

  @ApiProperty({ name: 'parent', required: false })
  @UUIDFieldOptional()
  parent?: Uuid;
}
