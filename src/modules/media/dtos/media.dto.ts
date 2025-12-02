import { getFileUrl } from '../../../common/utils.ts';
import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import {
  EnumField,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import { MediaEntity } from '../media.entity.ts';
import { MediaType } from '../../../constants/media-type.ts';

export class MediaDto extends AbstractDto {
  @StringField()
  fileExtension!: string;

  @EnumField(() => MediaType)
  mediaType!: MediaType;

  @NumberField()
  fileSize!: number;

  @StringFieldOptional()
  url?: string;

  constructor(media: MediaEntity) {
    super(media);
    this.fileExtension = media.fileExtension;
    this.mediaType = media.mediaType;
    this.fileSize = media.fileSize;
    this.url = this.url = getFileUrl(
      media.uuid,
      media.mediaType as any,
      media.bucketName,
      media.fileExtension,
    );
  }
}
