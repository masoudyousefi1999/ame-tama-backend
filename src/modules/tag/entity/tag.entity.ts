import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { MediaEntity } from '../../../modules/media/media.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { TagDto } from '../dto/tag.dto';
import { CategoryEntity } from '../../../modules/category/entity/category.entity';
import { ProductEntity } from '../../product/entity/product.entity';

@Entity({ name: 'tag' })
@UseDto(TagDto)
export class TagEntity extends AbstractEntity {
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

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'bigint' })
  imageId?: number;

  @ManyToOne(() => MediaEntity)
  @JoinColumn({ name: 'image_id', referencedColumnName: 'id' })
  image?: Relation<MediaEntity>;

  @ManyToMany(() => CategoryEntity, (category) => category.tags)
  @JoinTable({
    name: 'category_tag',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories?: Relation<CategoryEntity[]>;

  @ManyToMany(() => ProductEntity, (product) => product.tags)
  @JoinTable({
    name: 'product_tag',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products?: Relation<ProductEntity[]>;
}
