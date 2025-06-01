import { UserEntity } from '../../../modules/user/user.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { WalletDto } from '../dto/wallet.dto';

@Entity({ name: 'wallets' })
@UseDto(WalletDto)
export class WalletEntity extends AbstractEntity {
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  declare uuid: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  declare updatedAt: Date;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'bigint' })
  balance!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Relation<UserEntity>;
}
