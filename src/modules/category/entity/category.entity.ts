import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { CategoryDto } from '../dto/category.dto';
import { MediaEntity } from '../../../modules/media/media.entity';
import { TagEntity } from '../../../modules/tag/entity/tag.entity';

@UseDto(CategoryDto)
@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {
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

  @Column({ type: 'text' })
  description?: string;

  @Column({ type: 'bigint' })
  image?: number;

  parentId?: number;

  @ManyToOne(() => MediaEntity, { nullable: true })
  @JoinColumn({ name: 'image', referencedColumnName: 'id' })
  media?: Relation<MediaEntity>;

  @ManyToMany(() => TagEntity, (tag) => tag.categories)
  tags?: Relation<TagEntity[]>;
}
