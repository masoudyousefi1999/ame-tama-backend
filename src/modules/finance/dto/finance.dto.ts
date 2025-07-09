import { AbstractDto } from '../../../common/dto/abstract.dto';
import { FinanceCurrencyEnum } from '../enums/finance.current.enum';
import { FinanceTypeEnum } from '../enums/finance-type.enum';
import {
  ClassFieldOptional,
  StringField,
} from '../../../decorators/field.decorators';
import { UserDto } from '../../../modules/user/dtos/user.dto';
import type { FinanceEntity } from '../finance.entity';

export class FinanceDto extends AbstractDto {
  type!: FinanceTypeEnum;

  currency!: FinanceCurrencyEnum;

  @StringField()
  note!: string;

  @StringField()
  amount!: number;

  @ClassFieldOptional(() => UserDto)
  user?: UserDto;

  constructor(entity: FinanceEntity) {
    super(entity);
    this.type = entity.type;
    this.currency = entity.currency as FinanceCurrencyEnum;
    this.note = entity.note;
    this.amount = entity.amount;
    this.user = entity?.user ? new UserDto(entity.user) : undefined;
  }
}
