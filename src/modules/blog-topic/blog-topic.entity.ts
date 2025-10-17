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

  @OneToMany(() => BlogEntity, (blog) => blog.topic)
  blogs?: Relation<BlogEntity[]>;
}
