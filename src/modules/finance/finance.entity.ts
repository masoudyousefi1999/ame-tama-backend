import { AbstractEntity } from '../../common/abstract.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';
import { FinanceTypeEnum } from './enums/finance-type.enum';
import { FinanceCurrencyEnum } from './enums/finance.current.enum';
import type { UserEntity } from '.../../modules/user/user.entity';
import { UseDto } from '../../decorators/use-dto.decorator';
import { FinanceDto } from './dto/finance.dto';

@Entity({ name: 'finance' })
@UseDto(FinanceDto)
export class FinanceEntity extends AbstractEntity {
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  declare uuid: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @Column({
    type: 'enum',
    enum: FinanceTypeEnum,
    nullable: false,
  })
  type!: FinanceTypeEnum;

  @Column({
    type: 'enum',
    enum: FinanceCurrencyEnum,
    default: FinanceCurrencyEnum.TOMAN,
    nullable: false,
  })
  currency?: FinanceCurrencyEnum;

  @Column({ type: 'text' })
  note!: string;

  @Column({ type: 'bigint' })
  amount!: number;

  @Column({ type: 'bigint' })
  userId!: number;

  user?: UserEntity;
}
