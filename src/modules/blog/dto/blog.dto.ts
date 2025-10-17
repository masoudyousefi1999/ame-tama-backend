import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  BooleanField,
  ClassField,
  DateField,
  StringField,
} from '../../../decorators/field.decorators';
import { UserDto } from '../../user/dtos/user.dto';
import { BlogTopicDto } from '../../blog-topic/dto/blog-topic.dto';
import type { BlogEntity } from '../blog.entity';

export class BlogDto extends AbstractDto {
  @StringField()
  title!: string;

  @StringField()
  content!: string;

  @ClassField(() => UserDto)
  user?: UserDto;

  @ClassField(() => BlogTopicDto)
  topic?: BlogTopicDto;

  @BooleanField()
  isPublished!: boolean;

  @DateField()
  publishedAt?: Date;

  constructor(blog: BlogEntity) {
    super(blog);
    this.title = blog.title;
    this.content = blog.content;
    this.user = blog.user ? new UserDto(blog.user) : undefined;
    this.topic = blog.topic ? new BlogTopicDto(blog.topic) : undefined;
    this.isPublished = blog.isPublished;
    this.publishedAt = blog.publishedAt;
  }
}
