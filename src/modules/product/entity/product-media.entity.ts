import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { MediaEntity } from '../../../modules/media/media.entity';

@Entity({ name: 'product_media' })
export class ProductMediaEntity {
  @PrimaryColumn({ type: 'bigint' })
  productId!: number;

  @PrimaryColumn({ type: 'bigint' })
  mediaId!: number;

  @Column({ type: 'integer' })
  order!: number;

  @Column({ type: 'boolean' })
  isDefault!: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.productMedia, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Relation<ProductEntity>;

  @ManyToOne(() => MediaEntity)
  @JoinColumn({ name: 'media_id', referencedColumnName: 'id' })
  media?: Relation<MediaEntity>;
}
