import {
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class GetBlogTopicDto {
  @ApiProperty({ name: 'uuid', required: false })
  @UUIDFieldOptional()
  uuid?: Uuid;

  @ApiProperty({ name: 'slug', required: false })
  @StringFieldOptional()
  slug?: string;
}
