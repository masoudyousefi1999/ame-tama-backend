import { UseDto } from '../../../decorators/use-dto.decorator';
import { AbstractEntity } from '../../../common/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { OrderDto } from '../dto/order.dto';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { OrderItemEntity } from './order-item.entity';

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

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  @JoinColumn({ name: 'id', referencedColumnName: 'order_id' })
  items?: Relation<OrderItemEntity[]>;
}
