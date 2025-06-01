import { InjectRepository } from '@nestjs/typeorm';
import { ProductDetailEntity } from './entity/product-detail.entity';
import type { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export class ProductDetailRepository {
  constructor(
    @InjectRepository(ProductDetailEntity)
    private productDetailRepo: Repository<ProductDetailEntity>,
  ) {}

  async create(data: {
    character: string;
    description: string;
    productId: number;
    series: string;
    specifications: Record<string, any>;
  }) {
    const { character, description, productId, series, specifications } = data;
    const detail = this.productDetailRepo.create({
      character,
      description,
      productId,
      series,
      specifications,
    });

    await this.productDetailRepo.save(detail);

    return detail;
  }

  async update(data: {
    character?: string;
    description?: string;
    productId: number;
    series?: string;
    specifications?: Record<string, any>;
  }) {
    const { character, description, productId, series, specifications } = data;

    const isDetailExist = await this.findOne(productId);

    if (!isDetailExist) {
      throw new NotFoundException('product detail not founded');
    }

    const detail = await this.productDetailRepo.update(
      { productId },
      {
        character,
        description,
        productId,
        series,
        specifications,
      },
    );

    if (detail?.affected) {
      return await this.findOne(productId);
    }

    return detail;
  }

  async findOne(productId: number) {
    return await this.productDetailRepo.findOne({
      where: { productId },
    });
  }
}
