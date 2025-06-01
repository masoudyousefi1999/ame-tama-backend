import { ProductEntity } from '../../../modules/product/entity/product.entity';
import { Column, Entity, OneToOne, PrimaryColumn, type Relation } from 'typeorm';

@Entity({ name: 'product_details' })
export class ProductDetailEntity {
  @PrimaryColumn({ name: 'product_id' })
  productId!: number;

  @Column({ type: 'text' })
  series!: string;

  @Column({ type: 'text' })
  character!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  specifications?: Record<string, any>;

  @OneToOne(() => ProductEntity, (product) => product.detail)
  product!: Relation<ProductEntity>;
}
