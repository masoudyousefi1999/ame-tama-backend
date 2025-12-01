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
import { AbstractEntity } from '../../common/abstract.entity';
import { UserEntity } from '../user/user.entity';
import { BlogTopicEntity } from '../blog-topic/blog-topic.entity';
import { UseDto } from '../../decorators/use-dto.decorator';
import { BlogDto } from './dto/blog.dto';
import { MediaEntity } from '../media/media.entity';
import type { SeoEntity } from '../seo/seo.entity';

@Entity({ name: 'blog' })
@UseDto(BlogDto)
export class BlogEntity extends AbstractEntity<BlogDto> {
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
  content!: string;

  @Column({ type: 'text' })
  slug!: string;

  @Column({ type: 'int', default: 0 })
  viewCount!: number;

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ type: 'bigint' })
  topicId!: number;

  @Column({ type: 'bigint', nullable: true })
  imageId?: number;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @Column({ type: 'timestamp' })
  publishedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Relation<UserEntity>;

  @ManyToOne(() => BlogTopicEntity, (topic) => topic.id)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic?: Relation<BlogTopicEntity>;

  @ManyToOne(() => MediaEntity, { nullable: true })
  @JoinColumn({ name: 'image_id', referencedColumnName: 'id' })
  image?: Relation<MediaEntity>;

  seoMetadata?: Relation<SeoEntity>;
}
