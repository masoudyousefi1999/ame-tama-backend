import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PaymentEntity } from '../entity/payment.entity';
import {
  ClassFieldOptional,
  EnumField,
  NumberField,
} from '../../../decorators/field.decorators';
import { OrderDto } from '../../../modules/order/dto/order.dto';
import { PaymentStatusEnum } from '../enum/payment-status.enum';

export class PaymentDto extends AbstractDto {
  @NumberField()
  amount!: number;

  @EnumField(() => PaymentStatusEnum)
  status!: PaymentStatusEnum;

  @ClassFieldOptional(() => OrderDto)
  order?: OrderDto;

  constructor(entity: PaymentEntity) {
    super(entity);
    this.amount = entity.amount;
    this.status = entity.status;
    this.order = entity?.order ? new OrderDto(entity.order) : undefined;
  }
}
