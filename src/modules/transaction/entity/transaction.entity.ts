import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity({name: 'transactions'})
export class TransactionEntity extends AbstractEntity {
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  declare uuid: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @Column({ type: 'bigint' })
  paymentId?: number;

  @Column({ type: 'text' })
  method!: string;

  @Column({ type: 'text' })
  referenceId!: string;

  @Column({ type: 'text' })
  trackingCode!: string;

  @Column({ type: 'bigint' })
  amount!: number;

  @Column({ type: 'jsonb' })
  responseData?: Record<string, any>;

  @Column({ type: 'date' })
  paidAt?: string;
}
