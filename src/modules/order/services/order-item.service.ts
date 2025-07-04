import { ProductService } from './../../product/product.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderItemRepository } from '../repository/order-item.repository';
import type { ProductEntity } from '../../../modules/product/entity/product.entity';

@Injectable()
export class OrderItemService {
  constructor(
    private orderItemRepo: OrderItemRepository,
    private productService: ProductService,
  ) {}

  async addOrIncreaseItem(data: {
    orderId: number;
    product: ProductEntity;
    quantity: number;
  }) {
    const { orderId, product, quantity } = data;

    const productId = product.id;

    const isProductAddedAlready = await this.orderItemRepo.findOne({
      filter: { productId, orderId },
    });

    if (isProductAddedAlready) {
      const currentQuantity = isProductAddedAlready.quantity;

      const newQuantity = currentQuantity + quantity;

      if (newQuantity > product.quantity) {
        throw new BadRequestException(`product have no more quantity`);
      }

      const updatedItem = await this.orderItemRepo.update({
        filter: { id: isProductAddedAlready.id },
        updateData: { quantity: newQuantity },
      });

      return updatedItem;
    }

    if (quantity > product.quantity) {
      throw new BadRequestException(`product have no more quantity`);
    }

    const newItem = await this.orderItemRepo.create({
      productId,
      orderId,
      quantity,
    });

    return newItem;
  }

  async removeOrDecreaseItem(data: {
    orderId: number;
    productId: number;
    quantity: number;
  }) {
    const { orderId, productId, quantity } = data;

    const isProductAddedAlready = await this.orderItemRepo.findOne({
      filter: { productId, orderId },
    });

    if (!isProductAddedAlready) {
      throw new BadRequestException(
        `tou don't have this item on your order list`,
      );
    }

    const currentQuantity = isProductAddedAlready.quantity;
    let newQuantity: number;

    if (currentQuantity > quantity) {
      newQuantity = currentQuantity - quantity;
    } else {
      newQuantity = 0;
    }

    if (newQuantity > 0) {
      const updatedItem = await this.orderItemRepo.update({
        filter: { id: isProductAddedAlready.id },
        updateData: { quantity: newQuantity },
      });
      return updatedItem;
    }

    await this.orderItemRepo.delete({ productId, orderId });

    return;
  }

  async completeOrder(orderId: number) {
    const { document: items } = await this.orderItemRepo.find({
      filter: { orderId },
      relations: ['product'],
    });

    if (items.length === 0) {
      return true;
    }

    await Promise.all(
      items.map(async (item) => {
        const { id, product } = item;

        const productPrice = product?.price;
        const productNewQuantity = product?.quantity! - item.quantity;

        // set price for order items
        await this.orderItemRepo.update({
          filter: { id },
          updateData: {
            price: productPrice ? Math.floor(productPrice) : productPrice,
          },
        });

        // update product quantity
        await this.productService.updateProduct(product?.uuid!, {
          quantity: productNewQuantity,
        });
      }),
    );

    return true;
  }
}
