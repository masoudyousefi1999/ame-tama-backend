import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  EnumField,
  NumberField,
} from '../../../decorators/field.decorators';
import { OrderEntity } from '../entity/order.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { OrderItemDto } from './order-item.dto';

export class OrderDto extends AbstractDto {
  @NumberField()
  totalPrice?: number;

  @NumberField()
  finalPrice?: number;

  @EnumField(() => OrderStatusEnum)
  status!: OrderStatusEnum;

  @ClassFieldOptional(() => OrderItemDto, { each: true })
  items?: OrderItemDto[];

  constructor(entity: OrderEntity) {
    super(entity);
    this.totalPrice = entity.totalPrice;
    this.finalPrice = entity.finalPrice;
    this.status = entity.status;
    this.items = entity?.items
      ? entity.items.map((item) => new OrderItemDto(item))
      : [];
  }
}
