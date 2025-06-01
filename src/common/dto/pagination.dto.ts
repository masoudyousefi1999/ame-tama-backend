import { ApiProperty } from '@nestjs/swagger';
import { NumberFieldOptional } from '../../decorators/field.decorators';

export class PaginationDto {
  @ApiProperty({ required: false, type: Number, name: 'page', default: 1 })
  @NumberFieldOptional({ default: 1, min: 1 })
  page!: number;

  @ApiProperty({ required: false, type: Number, name: 'limit', default: 20 })
  @NumberFieldOptional({ default: 20, max: 20, min: 1 })
  limit!: number;

  constructor() {
    this.page = this.page || 1;
    this.limit = this.limit || 20;
  }
}
