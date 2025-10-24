import {
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogTopicDto {
  @ApiProperty({ name: 'name', required: false })
  @StringFieldOptional()
  name?: string;

  @ApiProperty({ name: 'slug', required: false })
  @StringFieldOptional()
  slug?: string;

  @ApiProperty({ name: 'description', required: false })
  @StringFieldOptional()
  description?: string;

  @ApiProperty({ name: 'image', required: false })
  @UUIDFieldOptional()
  image?: Uuid;
}
