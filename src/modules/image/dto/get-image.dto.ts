import {
  StringField,
  NumberFieldOptional,
  StringFieldOptional,
} from 'decorators/field.decorators';

export class GetImageDto {
  @StringField()
  url!: string;

  @NumberFieldOptional()
  w?: number;

  @NumberFieldOptional()
  h?: number;

  @NumberFieldOptional()
  q?: number;

  @StringFieldOptional()
  f?: 'webp' | 'avif' | 'jpeg' | 'jpg' | 'png';

  @StringFieldOptional()
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

  @StringFieldOptional()
  bg?: string; // hex color, e.g. "ffffff"
}
