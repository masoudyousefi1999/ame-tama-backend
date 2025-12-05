import { Injectable } from '@nestjs/common';
import { ShippingMethodRepository } from './repository/shipping-method.repository';

@Injectable()
export class ShippingMethodService {
  constructor(
    private readonly shippingMethodRepository: ShippingMethodRepository,
  ) {}

  async getAllShippingMethods() {
    const data = await this.shippingMethodRepository.find({
      filter: { isActive: true },
    });

    return data.document;
  }
}
