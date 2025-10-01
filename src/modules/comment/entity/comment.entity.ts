import { UserEntity } from '../../../modules/user/user.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { ProductEntity } from '../../../modules/product/entity/product.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { CommentDto } from '../dto/comment.dto';

@Entity({ name: 'comment' })
@UseDto(CommentDto)
export class CommentEntity extends AbstractEntity {
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  declare uuid: Uuid;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ type: 'bigint' })
  productId!: number;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  declare updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Relation<UserEntity>;

  @ManyToOne(() => ProductEntity, (product) => product.comments)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: Relation<ProductEntity>;
}
