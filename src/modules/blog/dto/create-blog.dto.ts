import { ApiProperty } from '@nestjs/swagger';
import { StringField, UUIDField, UUIDFieldOptional } from '../../../decorators/field.decorators';

export class CreateBlogDto {
  @ApiProperty({ name: 'title', required: true })
  @StringField()
  title!: string;

  @ApiProperty({ name: 'slug', required: true })
  @StringField()
  slug!: string;

  @ApiProperty({ name: 'topic', required: true })
  @UUIDField()
  topic!: Uuid;

  @ApiProperty({ name: 'content', required: true })
  @StringField()
  content!: string;

  @ApiProperty({ name: 'image', required: false })
  @UUIDFieldOptional()
  image?: Uuid;
}
