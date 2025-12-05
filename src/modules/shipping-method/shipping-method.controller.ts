import { Controller, Get } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('shipping-method')
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Get()
  @ApiOkResponse({
    type: [Object],
  })
  async getAllShippingMethods() {
    return await this.shippingMethodService.getAllShippingMethods();
  }
}
