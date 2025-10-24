import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  BooleanField,
  ClassField,
  ClassFieldOptional,
  DateField,
  StringField,
} from '../../../decorators/field.decorators';
import { UserDto } from '../../user/dtos/user.dto';
import type { BlogTopicDto } from '../../blog-topic/dto/blog-topic.dto';
import { MediaDto } from '../../media/dtos/media.dto';
import type { BlogEntity } from '../blog.entity';

export class BlogDto extends AbstractDto {
  @StringField()
  title!: string;

  @StringField()
  content!: string;

  @ClassField(() => UserDto)
  user?: UserDto;

  topic?: BlogTopicDto;

  @ClassFieldOptional(() => MediaDto)
  image?: MediaDto;

  @BooleanField()
  isPublished!: boolean;

  @DateField()
  publishedAt?: Date;

  constructor(blog: BlogEntity) {
    super(blog);
    this.title = blog.title;
    this.content = blog.content;
    this.user = blog.user ? new UserDto(blog.user) : undefined;
    this.isPublished = blog.isPublished;
    this.publishedAt = blog.publishedAt;
    this.image = blog.image ? new MediaDto(blog.image) : undefined;
    this.topic = blog.topic as BlogTopicDto;
  }
}
