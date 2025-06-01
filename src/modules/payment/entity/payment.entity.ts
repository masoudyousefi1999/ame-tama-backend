import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import type { OrderEntity } from '../../../modules/order/entity/order.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { PaymentDto } from '../dto/payment.dto';
import type { PaymentStatusEnum } from '../enum/payment-status.enum';

@Entity({ name: 'payments' })
@UseDto(PaymentDto)
export class PaymentEntity extends AbstractEntity {
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
  orderId!: number;

  @Column({ type: 'integer' })
  amount!: number;

  @Column({ type: 'integer' })
  status!: PaymentStatusEnum;

  order?: Relation<OrderEntity>;
}
