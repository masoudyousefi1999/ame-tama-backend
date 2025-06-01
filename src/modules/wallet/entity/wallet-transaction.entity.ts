import { Column, CreateDateColumn, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';

export const TransactionDirection = ['deposit', 'withdrawal'] as const;
export const TransactionInitiator = ['system', 'user'] as const;

export type TransactionDirectionType = (typeof TransactionDirection)[number];
export type TransactionInitiatorType = (typeof TransactionInitiator)[number];

@Entity({ name: 'wallet_transactions' })
export class WalletTransactionEntity extends AbstractEntity {
  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @Column({ type: 'bigint' })
  walletId!: number;

  @Column({ type: 'bigint' })
  amount!: number;

  @Column({ type: 'bigint' })
  paymentId?: number;

  @Column({ type: 'text' })
  transactionDirection!: TransactionDirectionType;

  @Column({ type: 'text' })
  transactionInitiator!: TransactionInitiatorType;

  @Column({ type: 'text' })
  description?: string;
}
