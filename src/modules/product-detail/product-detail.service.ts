import { Injectable } from '@nestjs/common';
import { ProductDetailRepository } from './product-detail.repository';

@Injectable()
export class ProductDetailService {
  constructor(private productDetailRepo: ProductDetailRepository) {}

  async create(data: {
    character: string;
    description?: string;
    productId: number;
    series: string;
    specifications?: Record<string, any>;
  }) {
    const { character, description, productId, series, specifications } = data;

    return await this.productDetailRepo.create({
      character,
      description: description || (undefined as any),
      productId,
      series,
      specifications: specifications || {},
    });
  }

  async findOne(productId: number) {
    return await this.productDetailRepo.findOne(productId);
  }

  async update(data: {
    character?: string;
    description?: string;
    productId: number;
    series?: string;
    specifications?: Record<string, any>;
  }) {
    return await this.productDetailRepo.update(data);
  }
}
