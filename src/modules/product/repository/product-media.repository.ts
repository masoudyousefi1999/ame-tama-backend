import { InjectRepository } from '@nestjs/typeorm';
import { ProductMediaEntity } from '../entity/product-media.entity';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductMediaRepository {
  constructor(
    @InjectRepository(ProductMediaEntity)
    private readonly ProductMediaRepo: Repository<ProductMediaEntity>,
  ) {}

  async create(createProductMediaDto: {
    productId: number;
    infos: { isDefault: boolean; mediaId: number; order: number }[];
  }) {
    const { productId, infos } = createProductMediaDto;
    const allProductMedias: ProductMediaEntity[] = [];

    infos.map((item) => {
      const { isDefault, mediaId, order } = item;

      const productMedia = this.ProductMediaRepo.create({
        isDefault,
        mediaId,
        order,
        productId,
      });

      allProductMedias.push(productMedia);
    });

    const newProductMedia = await this.ProductMediaRepo.save(allProductMedias);

    return newProductMedia;
  }
}
