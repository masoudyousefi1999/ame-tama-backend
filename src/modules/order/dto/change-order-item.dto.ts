import { ApiProperty } from '@nestjs/swagger';
import { NumberField, UUIDField } from '../../../decorators/field.decorators';

export class ChangeOrderItemDto {
  @ApiProperty({ name: 'productId', required: true })
  @UUIDField()
  productId!: Uuid;

  @ApiProperty({ name: 'quantity', required: true })
  @NumberField()
  quantity!: number;
}
