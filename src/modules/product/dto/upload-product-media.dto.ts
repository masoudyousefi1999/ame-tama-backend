import { ApiProperty } from '@nestjs/swagger';
import {
  BooleanFieldOptional,
  ClassField,
  NumberField,
  UUIDField,
} from '../../../decorators/field.decorators';

export class UploadProductMediaInfo {
  @ApiProperty({ type: 'string', required: true })
  @UUIDField()
  mediaId!: Uuid;

  @ApiProperty({ type: 'number', required: true })
  @NumberField()
  order!: number;

  @ApiProperty({ type: 'boolean', required: false })
  @BooleanFieldOptional()
  isDefault?: boolean;
}

export class UploadProductMediaDto {
  @ApiProperty({ type: 'string', required: true })
  @UUIDField()
  productId!: Uuid;

  @ClassField(() => UploadProductMediaInfo, { each: true })
  infos!: UploadProductMediaInfo[];
}
