import { StringField } from 'decorators/field.decorators';

export class CreateUserDto {
  @StringField()
  phone!: string;
}
