import { UseDto } from '../../../decorators/use-dto.decorator';
import { AbstractEntity } from '../../../common/abstract.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { UserAddressDto } from '../dto/user-address.dto';
import { UserEntity } from '../../../modules/user/user.entity';

@Entity({ name: 'user_addresses' })
@UseDto(UserAddressDto)
export class UserAddressEntity extends AbstractEntity {
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

  @DeleteDateColumn({
    type: 'timestamp',
  })
  declare deletedAt: Date | null;

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ type: 'text' })
  province!: string;

  @Column({ type: 'text' })
  city!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ type: 'text' })
  postalCode!: string;

  @Column({ type: 'text' })
  houseNumber!: string;

  @Column({ type: 'text' })
  floorNumber!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;
}
