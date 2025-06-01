import { ProductDto } from '../../../modules/product/dto/product.dto';
import {
  ClassFieldOptional,
  NumberField,
} from '../../../decorators/field.decorators';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { OrderItemEntity } from '../entity/order-item.entity';

export class OrderItemDto extends AbstractDto {
  @NumberField()
  quantity!: number;

  @NumberField()
  price?: number;

  @ClassFieldOptional(() => ProductDto)
  product?: ProductDto;

  constructor(entity: OrderItemEntity) {
    super(entity);
    this.quantity = entity.quantity;
    this.price = entity.price;
    this.product = entity?.product ? new ProductDto(entity.product) : undefined;
  }
}
