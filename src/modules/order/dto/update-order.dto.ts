import {
  EnumFieldOptional,
  StringFieldOptional,
} from 'decorators/field.decorators';
import { OrderStatusEnum } from '../enum/order-status.enum';

export class UpdateOrderDto {
  @EnumFieldOptional(() => OrderStatusEnum)
  status?: OrderStatusEnum;

  @StringFieldOptional()
  trackingCode?: string;
}
