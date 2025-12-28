import { MediaDto } from '../../media/dtos/media.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  ClassFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import { UserDto } from '../../user/dtos/user.dto';
import { TagDto } from '../../tag/dto/tag.dto';
import type { ArtWorkEntity } from '../entity/art-work.entity';

export class ArtWorkDto extends AbstractDto {
  @StringField()
  title!: string;

  @StringFieldOptional()
  description?: string;

  @ClassFieldOptional(() => MediaDto)
  image?: MediaDto;

  @ClassFieldOptional(() => UserDto)
  user?: UserDto;

  @ClassFieldOptional(() => TagDto)
  tag?: TagDto;

  @NumberField()
  likeCount!: number;

  @NumberField()
  dislikeCount!: number;

  @NumberField()
  viewCount!: number;
  constructor(artWork: ArtWorkEntity) {
    super(artWork);
    this.title = artWork.title;
    this.description = artWork.description;
    this.image = artWork.image ? new MediaDto(artWork.image) : undefined;
    this.user = artWork.user ? new UserDto(artWork.user) : undefined;
    this.tag = artWork.tag ? new TagDto(artWork.tag) : undefined;
    this.likeCount = artWork.likeCount;
    this.dislikeCount = artWork.dislikeCount;
    this.viewCount = artWork.viewCount;
  }
}
