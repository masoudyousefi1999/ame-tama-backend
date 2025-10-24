import {
  StringField,
  UUIDFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators';

export class CreateTagDto {
  @StringField()
  name!: string;

  @StringField()
  slug!: string;

  @StringFieldOptional()
  description?: string;

  @UUIDFieldOptional()
  imageId?: Uuid;
}
