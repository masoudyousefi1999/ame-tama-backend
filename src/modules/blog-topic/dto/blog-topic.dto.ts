import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField } from '../../../decorators/field.decorators';
import type { BlogTopicEntity } from '../blog-topic.entity';

export class BlogTopicDto extends AbstractDto {
  @StringField()
  name!: string;

  @StringField()
  slug!: string;

  @StringField()
  description!: string;

  constructor(blogTopic: BlogTopicEntity) {
    super(blogTopic);
    this.name = blogTopic.name;
    this.slug = blogTopic.slug;
    this.description = blogTopic.description;
  }
}
