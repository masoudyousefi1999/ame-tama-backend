import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ArtWorkRepository } from './repository/art-work.repository';
import type { CreateArtWorkDto } from './dto/create-art-work.dto';
import type { UserEntity } from '../user/user.entity';
import { MediaService } from '../media/media.service';
import { TagService } from '../tag/tag.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsNull } from 'typeorm';
import type { ReactToArtWorkDto } from './dto/reaction-to-art-work.dto';
import { ArtWorkReactionRepository } from './repository/art-work-reaction.repository';
import { ReactionEnum } from './reaction.enum';
import { RedisService } from '../../shared/services/redis.service';
import type { Request } from 'express';

@Injectable()
export class ArtWorkService {
  constructor(
    private artWorkRepository: ArtWorkRepository,
    private artWorkReactionRepository: ArtWorkReactionRepository,
    private mediaService: MediaService,
    private tagService: TagService,
    private redisService: RedisService,
  ) {}

  async createArtWork(createArtWorkDto: CreateArtWorkDto, user: UserEntity) {
    try {
      const { image, tag, ...rest } = createArtWorkDto;

      const imageEntity = await this.mediaService.getMedia({ uuid: image });

      if (!imageEntity) {
        throw new NotFoundException('image not found');
      }

      const tagEntity = await this.tagService.findOneTag({ uuid: tag });

      if (!tagEntity) {
        throw new NotFoundException('tag not found');
      }

      const artWork = await this.artWorkRepository.create({
        ...rest,
        imageId: imageEntity.id,
        tagId: tagEntity.id,
        userId: user.id,
        isPublished: false,
      });

      return artWork.toDto();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create art work');
    }
  }

  async getArtWorks(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const { document, count } = await this.artWorkRepository.find({
      page,
      limit,
      relations: ['image', 'user'],
      order: { createdAt: 'desc' },
      filter: {
        deletedAt: IsNull(),
        isPublished: true,
      },
    });

    const normalizedArtWorks = document.map((item) => item.toDto());

    return { artWorks: normalizedArtWorks, totalCount: count };
  }

  async getArtWork(uuid: Uuid) {
    const artWork = await this.artWorkRepository.findOne({
      filter: {
        uuid,
        deletedAt: IsNull(),
        isPublished: true,
      },
      relations: ['image', 'tag', 'user'],
    });

    if (!artWork) {
      throw new NotFoundException('art work not found');
    }

    return artWork.toDto();
  }

  async reactToArtWork(
    uuid: Uuid,
    user: UserEntity,
    reactionDto: ReactToArtWorkDto,
  ) {
    const { reaction } = reactionDto;
    let likeCount = 0;
    let dislikeCount = 0;

    const artWork = await this.artWorkRepository.findOne({
      filter: { uuid, deletedAt: IsNull(), isPublished: true },
    });

    if (!artWork) {
      throw new NotFoundException('art work not found');
    }

    const isReacted = await this.artWorkReactionRepository.findOne({
      filter: {
        artworkId: artWork.id,
        userId: user.id,
      },
    });

    if (isReacted) {
      const isSameReaction = isReacted.reaction === reaction;
      if (isSameReaction) {
        await this.artWorkReactionRepository.delete({ id: isReacted.id });
        if (reaction === ReactionEnum.LIKE) {
          likeCount = likeCount - 1;
        } else {
          dislikeCount = dislikeCount - 1;
        }
      } else {
        await this.artWorkReactionRepository.update({
          updateData: { reaction },
          filter: { id: isReacted.id },
        });

        if (reaction === ReactionEnum.LIKE) {
          likeCount = likeCount + 1;
          dislikeCount = dislikeCount - 1;
        } else {
          dislikeCount = dislikeCount + 1;
          likeCount = likeCount - 1;
        }
      }
    } else {
      await this.artWorkReactionRepository.create({
        artworkId: artWork.id,
        userId: user.id,
        reaction,
      });
      if (reaction === ReactionEnum.LIKE) {
        likeCount = likeCount + 1;
      } else {
        dislikeCount = dislikeCount + 1;
      }
    }

    const updatedLikeCOunt = Number(artWork.likeCount) + likeCount;
    const updatedDislikeCount = Number(artWork.dislikeCount) + dislikeCount;

    await this.artWorkRepository.update({
      updateData: {
        ...(updatedLikeCOunt !== Number(artWork.likeCount) && {
          likeCount: updatedLikeCOunt,
        }),
        ...(updatedDislikeCount !== Number(artWork.dislikeCount) && {
          dislikeCount: updatedDislikeCount,
        }),
      },
      filter: { id: artWork.id },
    });

    return { message: 'Reaction updated successfully' };
  }

  async getArtWorkReaction(uuid: Uuid, user: UserEntity) {
    const artWork = await this.artWorkRepository.findOne({
      filter: { uuid, deletedAt: IsNull(), isPublished: true },
    });

    if (!artWork) {
      throw new NotFoundException('art work not found');
    }

    const reaction = await this.artWorkReactionRepository.findOne({
      filter: {
        artworkId: artWork.id,
        userId: user.id,
      },
    });

    if (!reaction) {
      return { reaction: null };
    }

    return { reaction: reaction.reaction };
  }

  async watchArtWork(uuid: Uuid, request: Request) {
    try {
      const userAgent = request.headers['user-agent'] || request.ip;

      if (userAgent) {
        const isUserAlreadyWatched = await this.redisService.getCachedData(
          `art-work:watch:${uuid}:${userAgent}`,
        );

        if (isUserAlreadyWatched) {
          return null;
        }
      }

      const artWork = await this.artWorkRepository.findOne({
        filter: { uuid, deletedAt: IsNull(), isPublished: true },
      });

      if (!artWork) {
        throw new NotFoundException('art work not found');
      }

      await this.artWorkRepository.update({
        updateData: {
          viewCount: Number(artWork.viewCount) + 1,
        },
        filter: { id: artWork.id },
      });

      if (userAgent) {
        await this.redisService.cacheData(
          `art-work:watch:${uuid}:${userAgent}`,
          'true',
          60 * 60 * 24,
        );
      }

      return { message: 'Art work watched successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to watch art work');
    }
  }
}
