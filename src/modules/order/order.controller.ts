import { ChangeOrderItemDto } from './dto/change-order-item.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { Auth } from '../../decorators/http.decorators';
import { AuthUser } from '../../decorators/auth-user.decorator';
import type { UserEntity } from '../../modules/user/user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Auth([])
  @Get()
  @ApiResponse({ type: OrderDto })
  async getOrder(@AuthUser() user: UserEntity) {
    const order = await this.orderService.getOrCreateOrder(user, true);

    return order.toDto();
  }

  @Auth([])
  @Post('/increase')
  @ApiResponse({ type: OrderDto })
  async addItemToOrder(
    @AuthUser() user: UserEntity,
    @Body() changeOrderItemDto: ChangeOrderItemDto,
  ) {
    return await this.orderService.addOrIncreaseItem(user, changeOrderItemDto);
  }

  @Auth([])
  @Post('/decrease')
  @ApiResponse({ type: OrderDto })
  async removeItemFromOrder(
    @AuthUser() user: UserEntity,
    @Body() changeOrderItemDto: ChangeOrderItemDto,
  ) {
    return await this.orderService.removeOrDecreaseItem(
      user,
      changeOrderItemDto,
    );
  }
}
