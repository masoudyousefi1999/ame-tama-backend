import { Injectable, NotFoundException } from '@nestjs/common';
import { SeoRepository } from './seo.repository';
import { CreateSeoDto } from './dto/create-seo.dto';
import { MediaService } from '../media/media.service';
import { SeoTypeEnum } from './seo-type.enum';

@Injectable()
export class SeoService {
  constructor(
    private readonly seoRepository: SeoRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createSeo(createSeoDto: CreateSeoDto) {
    const { ogImage, metaDescription, ...rest } = createSeoDto;

    let imageId = null;

    if (ogImage) {
      const media = await this.mediaService.getMedia({ uuid: ogImage });
      if (!media) {
        throw new NotFoundException('media not founded');
      }
      imageId = media.id;
    }

    const truncatedDescription = this.truncateWithEllipsis(metaDescription);

    return this.seoRepository.create({
      ...rest,
      metaDescription: truncatedDescription,
      ogDescription: truncatedDescription,
      ...(imageId ? { ogImage: imageId } : {}),
    });
  }

  async getSeo(entityType: SeoTypeEnum, entityId: number) {
    const seo = await this.seoRepository.findOne({
      filter: { entityType, entityId },
    });

    return seo;
  }

  truncateWithEllipsis(text: string, maxLength = 147): string {
    if (text.length <= maxLength) {
      return text;
    }
    let truncated = text.slice(0, maxLength);

    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      truncated = truncated.slice(0, lastSpace);
    }

    return truncated + '…';
  }
}
