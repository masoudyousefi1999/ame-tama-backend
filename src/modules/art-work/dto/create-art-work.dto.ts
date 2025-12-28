import { ApiProperty } from '@nestjs/swagger';
import {
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../../../decorators/field.decorators';

export class CreateArtWorkDto {
  @ApiProperty({ name: 'title', required: true })
  @StringField()
  title!: string;

  @ApiProperty({ name: 'description', required: false })
  @StringFieldOptional()
  description?: string;

  @ApiProperty({ name: 'image', required: true })
  @UUIDField()
  image!: Uuid;

  @ApiProperty({ name: 'tag', required: true })
  @UUIDField()
  tag!: Uuid;
}
