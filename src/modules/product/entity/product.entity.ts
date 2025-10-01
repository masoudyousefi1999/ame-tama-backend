import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { CategoryEntity } from '../../../modules/category/entity/category.entity';
import { ProductDto } from '../dto/product.dto';
import { ProductMediaEntity } from './product-media.entity';
import { ProductDetailEntity } from '../../../modules/product-detail/entity/product-detail.entity';
import { CommentEntity } from '../../../modules/comment/entity/comment.entity';

@Entity({ name: 'products' })
@UseDto(ProductDto)
export class ProductEntity extends AbstractEntity {
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  declare uuid: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  declare updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  declare deletedAt: Date | null;

  @Column({ type: 'bigint' })
  categoryId!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  slug!: string;

  @Column({ type: 'bigint' })
  price!: number;

  @Column({ type: 'integer', default: 0 })
  quantity!: number;

  @Column({ type: 'numeric' })
  rating?: number;

  @Column({ type: 'boolean' })
  inStock!: boolean;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Relation<CategoryEntity>;

  @OneToMany(() => ProductMediaEntity, (item) => item.product)
  @JoinColumn({ name: 'id', referencedColumnName: 'productId' })
  productMedia?: ProductMediaEntity[];

  @ManyToOne(() => ProductDetailEntity)
  @JoinColumn({ name: 'id', referencedColumnName: 'productId' })
  detail?: Relation<any>;

  @OneToMany(() => CommentEntity, (comment) => comment.product)
  comments!: Relation<CommentEntity[]>;
}
