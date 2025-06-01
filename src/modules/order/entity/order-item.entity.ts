import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../../modules/product/entity/product.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { OrderItemDto } from '../dto/order-item.dto';

@Entity({ name: 'order_items' })
@UseDto(OrderItemDto)
export class OrderItemEntity extends AbstractEntity {
  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  declare updatedAt: Date;

  @Column({ type: 'bigint' })
  orderId!: number;

  @Column({ type: 'bigint' })
  productId!: number;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'integer' })
  price?: number;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order?: Relation<OrderEntity>;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: Relation<ProductEntity>;
}
