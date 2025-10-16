import { UseDto } from '../../../decorators/use-dto.decorator';
import { AbstractEntity } from '../../../common/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { OrderDto } from '../dto/order.dto';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { OrderItemEntity } from './order-item.entity';
import { UserAddressEntity } from '../../../modules/user-address/entity/user-address.entity';
import { UserEntity } from '../../../modules/user/user.entity';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity {
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

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ type: 'bigint' })
  totalPrice?: number;

  @Column({ type: 'bigint' })
  finalPrice?: number;

  @Column({ type: 'enum', enum: OrderStatusEnum })
  status!: OrderStatusEnum;

  @Column({ type: 'bigint' })
  addressId?: number;

  @Column({ type: 'text', nullable: true })
  trackingCode?: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  @JoinColumn({ name: 'id', referencedColumnName: 'order_id' })
  items?: Relation<OrderItemEntity[]>;

  @ManyToOne(() => UserAddressEntity)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address?: Relation<UserAddressEntity>;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Relation<UserEntity>;
}
