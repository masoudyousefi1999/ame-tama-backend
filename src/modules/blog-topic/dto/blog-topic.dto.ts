import { MediaDto } from '../../media/dtos/media.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  StringField,
} from '../../../decorators/field.decorators';
import type { BlogTopicEntity } from '../blog-topic.entity';
import { BlogDto } from '../../blog/dto/blog.dto';

export class BlogTopicDto extends AbstractDto {
  @StringField()
  name!: string;

  @StringField()
  slug!: string;

  @StringField()
  description!: string;

  @ClassFieldOptional(() => MediaDto)
  image?: MediaDto;

  @ClassFieldOptional(() => BlogDto, { each: true })
  blogs?: BlogDto[];

  constructor(blogTopic: BlogTopicEntity) {
    super(blogTopic);
    this.name = blogTopic.name;
    this.slug = blogTopic.slug;
    this.description = blogTopic.description;
    this.image = blogTopic?.image ? new MediaDto(blogTopic.image) : undefined;
    this.blogs = blogTopic?.blogs
      ? blogTopic?.blogs.map((blog) => new BlogDto(blog))
      : [];
  }
}
