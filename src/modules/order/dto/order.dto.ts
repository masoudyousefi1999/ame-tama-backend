import { UserAddressDto } from '../../../modules/user-address/dto/user-address.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  EnumField,
  StringField,
  NumberField,
} from '../../../decorators/field.decorators';
import { OrderEntity } from '../entity/order.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { OrderItemDto } from './order-item.dto';
import { UserDto } from '../../../modules/user/dtos/user.dto';

export class OrderDto extends AbstractDto {
  @NumberField()
  totalPrice?: number;

  @NumberField()
  finalPrice?: number;

  @EnumField(() => OrderStatusEnum)
  status!: OrderStatusEnum;

  @StringField()
  trackingCode?: string;

  @ClassFieldOptional(() => OrderItemDto, { each: true })
  items?: OrderItemDto[];

  @ClassFieldOptional(() => UserAddressDto)
  address?: UserAddressDto;

  @ClassFieldOptional(() => UserDto)
  user?: UserDto;

  constructor(entity: OrderEntity) {
    super(entity);
    this.totalPrice = entity.totalPrice;
    this.finalPrice = entity.finalPrice;
    this.status = entity.status;
    this.trackingCode = entity.trackingCode;
    this.items = entity?.items
      ? entity.items.map((item) => new OrderItemDto(item))
      : [];
    this.address = entity?.address
      ? new UserAddressDto(entity.address)
      : undefined;
    this.user = entity?.user ? new UserDto(entity.user) : undefined;
  }
}
