import { ApiProperty } from '@nestjs/swagger';
import {
  NumberFieldOptional,
  StringField,
} from '../../../decorators/field.decorators';

export class SearchDto {
  @ApiProperty({ required: false, type: Number, name: 'page', default: 1 })
  @NumberFieldOptional({ default: 1, min: 1 })
  page!: number;

  @ApiProperty({ required: false, type: Number, name: 'limit', default: 20 })
  @NumberFieldOptional({ default: 20, max: 20, min: 1 })
  limit!: number;

  @StringField({ minLength: 2 })
  search!: string;

  constructor() {
    this.page = this.page || 1;
    this.limit = this.limit || 20;
    this.search = this.search;
  }
}
