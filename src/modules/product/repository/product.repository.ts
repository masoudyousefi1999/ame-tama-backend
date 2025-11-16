import { AbstractRepository } from '../../../common/abstract.repository';
import { ProductEntity } from './../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    protected productRepo: Repository<ProductEntity>,
  ) {
    super(productRepo);
  }

  async searchProduct(search: string, page: number = 1, limit: number = 50) {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.detail', 'detail') // assuming relation
      .leftJoinAndSelect('product.productMedia', 'productMedia') // ProductMedia relation
      .leftJoinAndSelect('productMedia.media', 'media') // Media relation
      .leftJoinAndSelect('product.category', 'category') // Category relation
      .leftJoinAndSelect('product.tags', 'tags') // Tags relation
      .where('product.deleted_at IS NULL') // skip soft-deleted products
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.andWhere(
        `
        product.search_vector @@ plainto_tsquery(:search)
        OR detail.search_vector @@ plainto_tsquery(:search)
        OR product.name ILIKE :likeSearch
        OR detail.character ILIKE :likeSearch
  `,
        {
          search,
          likeSearch: `%${search}%`,
        },
      );
    }

    const [items, total] = await query.getManyAndCount();
    return {
      data: items,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async getSimilarProduct(data: {
    currentProduct: ProductEntity;
    page: number;
    limit: number;
  }) {
    const { currentProduct, page, limit } = data;

    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.detail', 'detail')
      .leftJoinAndSelect('product.productMedia', 'productMedia')
      .leftJoinAndSelect('productMedia.media', 'media')
      .leftJoinAndSelect('product.category', 'category') // Category relation
      .leftJoinAndSelect('product.tags', 'tags')
      .where('product.deletedAt IS NULL')
      .andWhere('product.categoryId = :categoryId', {
        categoryId: currentProduct.categoryId,
      })
      .andWhere('product.id != :productId', { productId: currentProduct.id })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC');

    let [items, total] = await query.getManyAndCount();

    // 🟡 Fallback: No similar items found — fetch any other products
    if (items.length === 0) {
      const fallbackQuery = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.detail', 'detail')
        .leftJoinAndSelect('product.productMedia', 'productMedia')
        .leftJoinAndSelect('productMedia.media', 'media')
        .where('product.deletedAt IS NULL')
        .andWhere('product.id != :productId', { productId: currentProduct.id })
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('product.createdAt', 'DESC');

      [items, total] = await fallbackQuery.getManyAndCount();
    }

    return {
      products: items,
      totalCount: Math.ceil(total / limit),
    };
  }
}
