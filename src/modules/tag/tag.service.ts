import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TagRepository } from './tag.repository';
import type { CreateTagDto } from './dto/create-tag.dto';
import { MediaService } from '../../modules/media/media.service';
import { IsNull, type FindOptionsWhere } from 'typeorm';
import type { TagEntity } from './entity/tag.entity';
import { ProductService } from '../../modules/product/product.service';
import type { PaginationDto } from 'common/dto/pagination.dto';
import type { TagDto } from './dto/tag.dto';
import { SeoService } from '../seo/seo.service';
import { SeoTypeEnum } from '../seo/seo-type.enum';
import { ModuleRef } from '@nestjs/core';
import type { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  private productService!: ProductService;
  constructor(
    private tagRepository: TagRepository,
    private mediaService: MediaService,
    private seoService: SeoService,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.productService = this.moduleRef.get(ProductService, {
      strict: false,
    });
  }

  async createTag(createTagDto: CreateTagDto) {
    const { image, slug, ...rest } = createTagDto;

    const isSlugExist = await this.findOneTag({ slug });

    if (isSlugExist) {
      throw new BadRequestException('slug already exists');
    }

    let currentImageId = null;

    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });

      if (!media) {
        throw new NotFoundException('media not founded');
      }

      currentImageId = media.id;
    }

    const tag = await this.tagRepository.create({
      ...rest,
      slug,
      ...(currentImageId ? { imageId: currentImageId } : {}),
    });

    return tag.toDto();
  }

  async findAllTags(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const { document, count } = await this.tagRepository.find({
      filter: { deletedAt: IsNull() },
      relations: ['image'],
      page,
      limit,
    });

    if (document.length === 0) {
      return {
        tags: [],
        totalCount: 0,
      };
    }

    const normalizedTags = document.map((item) => item.toDto());

    return { tags: normalizedTags, totalCount: count };
  }

  async findProductByTagSlug(slug: string, paginationDto: PaginationDto) {
    const tag = await this.tagRepository.findOne({
      filter: { slug, deletedAt: IsNull(), products: { deletedAt: IsNull() } },
      relations: ['image', 'categories', 'categories.media'],
    });

    if (!tag) {
      throw new NotFoundException('tag not found');
    }

    const { products, totalCount } =
      await this.productService.findProductsByTag(slug, paginationDto);

    const tagSeo = await this.getTagSeo(tag.id);
    tag.seoMetadata = tagSeo as any;

    tag.products = products.map((product) => product.toDto()) as any;
    tag.categories = tag.categories?.map((category) => category.toDto()) as any;

    const tagDto = tag.toDto();

    return { tag: tagDto, totalCount };
  }

  async findOneTag(filter: FindOptionsWhere<TagEntity>, relations?: string[]) {
    return await this.tagRepository.findOne({
      filter: { ...filter, deletedAt: IsNull() },
      relations,
    });
  }

  async getTagForSiteMap() {
    const { document: tags } = await this.tagRepository.find({
      filter: { deletedAt: IsNull(), categories: { deletedAt: IsNull() } },
      relations: ['image', 'categories'],
      page: 1,
      limit: 1000,
    });

    return tags.map((tag) => tag.toDto()) as TagDto[];
  }

  async getTagSeo(tagId: number) {
    return await this.seoService.getSeo(SeoTypeEnum.TAG, tagId);
  }

  async findOneTagByUuid(uuid: Uuid) {
    const tag = await this.findOneTag({ uuid }, ['image']);

    if (!tag) {
      throw new NotFoundException('tag not found');
    }

    return tag.toDto();
  }

  async updateTag(uuid: Uuid, updateTagDto: UpdateTagDto) {
    const tag = await this.findOneTag({ uuid });

    if (!tag) {
      throw new NotFoundException('tag not found');
    }
    const { image, ...rest } = updateTagDto;

    let currentImageId = null;

    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });
      if (!media) {
        throw new NotFoundException('media not founded');
      }
      currentImageId = media;
    }

    const updated = await this.tagRepository.update({
      filter: { id: tag.id },
      updateData: {
        ...rest,
        ...(currentImageId && { image: currentImageId }),
      },
    });

    return updated?.toDto();
  }

  async findOneTagBySlug(slug: string, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const tag = await this.findOneTag({ slug }, ['image', 'categories', 'categories.media']);

    if (!tag) {
      throw new NotFoundException('tag not found');
    }

    const { products: tagProducts, totalCount } =
      await this.productService.findProductsByTag(slug, { page, limit });

    tag.products = tagProducts.map((product) => product.toDto()) as any;
    tag.categories = tag.categories?.map((category) => category.toDto()) as any;

    return { tag: tag.toDto(), totalCount };
  }
}
