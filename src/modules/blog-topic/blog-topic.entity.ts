import {
  Column,
  Entity,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  type Relation,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators/use-dto.decorator';
import { BlogTopicDto } from './dto/blog-topic.dto';
import { BlogEntity } from '../blog/blog.entity';
import { MediaEntity } from '../media/media.entity';

@Entity({ name: 'blog_topic' })
@UseDto(BlogTopicDto)
export class BlogTopicEntity extends AbstractEntity {
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
  description!: string;

  @Column({ type: 'bigint', nullable: true, name: 'image_id' })
  imageId?: number;

  @OneToMany(() => BlogEntity, (blog) => blog.topic)
  blogs?: Relation<BlogEntity[]>;

  @OneToMany(() => BlogEntity, (blog) => blog.topic)
  image?: Relation<MediaEntity>;
}
