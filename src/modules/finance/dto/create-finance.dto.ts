import {
  EnumField,
  NumberField,
  StringField,
} from '../../../decorators/field.decorators';
import { FinanceTypeEnum } from '../enums/finance-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFinanceDto {
  @ApiProperty({ enum: FinanceTypeEnum, required: true })
  @EnumField(() => FinanceTypeEnum)
  type!: FinanceTypeEnum;

  @ApiProperty({ name: 'note', required: true })
  @StringField()
  note!: string;

  @ApiProperty({ name: 'amount', required: true, type: Number })
  @NumberField()
  amount!: number;
}
