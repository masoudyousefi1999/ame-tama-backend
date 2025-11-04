import { ApiProperty } from '@nestjs/swagger';
import { StringField, UUIDField } from '../../../decorators/field.decorators';

export class AddNewsDto {
  @ApiProperty({ name: 'title', required: true })
  @StringField()
  title!: string;

  @ApiProperty({ name: 'content', required: true })
  @StringField()
  content!: string;

  @ApiProperty({ name: 'slug', required: true })
  @StringField()
  slug!: string;

  @ApiProperty({ name: 'image', required: true })
  @UUIDField()
  image!: Uuid;

  @ApiProperty({ name: 'url', required: true })
  @StringField()
  url!: string;
}
