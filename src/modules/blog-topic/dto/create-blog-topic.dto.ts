import { ApiProperty } from '@nestjs/swagger';
import {
  StringField,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';

export class CreateBlogTopicDto {
  @ApiProperty({ name: 'name', required: true })
  @StringField()
  name!: string;

  @ApiProperty({ name: 'slug', required: true })
  @StringField()
  slug!: string;

  @ApiProperty({ name: 'description', required: true })
  @StringField()
  description!: string;

  @ApiProperty({ name: 'image', required: false })
  @UUIDFieldOptional()
  image?: Uuid;
}
