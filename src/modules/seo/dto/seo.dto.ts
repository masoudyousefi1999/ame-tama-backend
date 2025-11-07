import { MediaDto } from '../../media/dtos/media.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  EnumField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import { SeoTypeEnum } from '../seo-type.enum';
import { SeoEntity } from '../seo.entity';

export class SeoDto extends AbstractDto {
  @EnumField(() => SeoTypeEnum)
  entityType!: SeoTypeEnum;

  @StringField()
  metaTitle!: string;

  @StringField()
  metaDescription!: string;

  @StringField()
  canonicalUrl!: string;

  @StringField()
  ogTitle!: string;

  @StringField()
  ogDescription!: string;

  @StringFieldOptional()
  ogImage?: string;

  @ClassFieldOptional(() => MediaDto)
  ogImageMedia?: MediaDto;

  @StringField()
  twitterCard!: string;

  constructor(seo: SeoEntity) {
    super(seo);
    this.entityType = seo.entityType;
    this.metaTitle = seo.metaTitle;
    this.metaDescription = seo.metaDescription;
    this.canonicalUrl = seo.canonicalUrl;
    this.ogTitle = seo.ogTitle;
    this.ogDescription = seo.ogDescription;
    this.ogImageMedia = seo.ogImageMedia
      ? new MediaDto(seo.ogImageMedia)
      : undefined;
    this.ogImage = seo.ogImageMedia?.url || undefined;
    this.twitterCard = seo.twitterCard;

    delete this.ogImageMedia;
  }
}
