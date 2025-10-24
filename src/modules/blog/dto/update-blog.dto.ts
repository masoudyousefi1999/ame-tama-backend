import {
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogDto {
  @ApiProperty({ name: 'title', required: false })
  @StringFieldOptional()
  title?: string;

  @ApiProperty({ name: 'content', required: false })
  @StringFieldOptional()
  content?: string;

  @ApiProperty({ name: 'slug', required: false })
  @StringFieldOptional()
  slug?: string;

  @ApiProperty({ name: 'topic', required: false })
  @UUIDFieldOptional()
  topic?: Uuid;

  @ApiProperty({ name: 'image', required: false })
  @UUIDFieldOptional()
  image?: Uuid;
}
