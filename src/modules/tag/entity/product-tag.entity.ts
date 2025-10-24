import { ProductEntity } from '../../../modules/product/entity/product.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { TagEntity } from './tag.entity';

@Entity({ name: 'product_tag' })
export class ProductTagEntity {
  @PrimaryColumn({ type: 'bigint', name: 'product_id' })
  productId!: number;

  @PrimaryColumn({ type: 'bigint', name: 'tag_id' })
  tagId!: number;

  @ManyToOne(() => ProductEntity, (product) => product.tags, {
    onDelete: 'CASCADE',
  })
  product?: Relation<ProductEntity>;

  @ManyToOne(() => TagEntity)
  @JoinColumn({ name: 'tag_id', referencedColumnName: 'id' })
  tag?: Relation<TagEntity>;
}
