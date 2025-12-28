import { MediaEntity } from '../../media/media.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { TagEntity } from '../../tag/entity/tag.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { ArtWorkDto } from '../dto/article.dto';

@Entity({ name: 'art_work' })
@UseDto(ArtWorkDto)
export class ArtWorkEntity extends AbstractEntity {
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
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'bigint' })
  imageId!: number;

  @ManyToOne(() => MediaEntity, { eager: true })
  @JoinColumn({ name: 'image_id', referencedColumnName: 'id' })
  image!: Relation<MediaEntity>;

  @Column({ type: 'bigint' })
  userId!: number;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: Relation<UserEntity>;

  @Column({ type: 'bigint' })
  tagId!: number;

  @ManyToOne(() => TagEntity, { eager: true })
  @JoinColumn({ name: 'tag_id', referencedColumnName: 'id' })
  tag!: Relation<TagEntity>;

  @Column({ type: 'bigint', default: 0 })
  likeCount!: number;

  @Column({ type: 'bigint', default: 0 })
  dislikeCount!: number;

  @Column({ type: 'bigint', default: 0 })
  viewCount!: number;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;
}
