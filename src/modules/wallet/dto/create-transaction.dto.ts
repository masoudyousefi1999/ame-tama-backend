import {
  TransactionDirection,
  TransactionInitiator,
  type TransactionDirectionType,
  type TransactionInitiatorType,
} from './../entity/wallet-transaction.entity';
import {
  ClassField,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import { UserEntity } from 'modules/user/user.entity';


export class CreateTransactionDto {
  @ClassField(() => UserEntity)
  user!: UserEntity;

  @NumberField()
  amount!: number;

//   @ClassField(() => )
  payment?: any;

  @StringField()
  transactionDirection!: TransactionDirectionType;

  @StringField({ enum: TransactionDirection })
  transactionInitiator!: TransactionInitiatorType;

  @StringFieldOptional({ enum: TransactionInitiator })
  description?: string;
}
