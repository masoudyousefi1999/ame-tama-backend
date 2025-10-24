import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { MediaService } from '../../modules/media/media.service';
import { IsNull, type FindOptionsWhere } from 'typeorm';
import type { CategoryEntity } from './entity/category.entity';
import type { CategoryDto } from './dto/category.dto';
import { RedisService } from '../../shared/services/redis.service';
import { ProductService } from '../../modules/product/product.service';
import type { PaginationDto } from 'common/dto/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private mediaService: MediaService,
    private redisService: RedisService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { image, parent, ...rest } = createCategoryDto;

    let imageId = null;
    let parentId = null;

    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });

      if (!media) {
        throw new NotFoundException('media not founded');
      }

      imageId = media.id;
    }

    if (parent) {
      const parentCategory = await this.categoryRepository.findOne({
        filter: {
          uuid: parent,
        },
      });

      if (!parentCategory) {
        throw new NotFoundException('parent category not founded');
      }

      parentId = parentCategory.id;
    }

    const category = await this.categoryRepository.create({
      ...rest,
      ...(imageId ? { image: imageId } : {}),
      ...(parentId ? { parentId } : {}),
    });

    return category.toDto();
  }

  async findAll(): Promise<CategoryDto[]> {
    const isCached = await this.redisService.getCachedData('findAllCategories');
    if (isCached) {
      return JSON.parse(isCached);
    }
    const { document: categories } = await this.categoryRepository.find({
      filter: { deletedAt: IsNull() },
      relations: ['media', 'tags', 'tags.image'],
    });

    const normalizedCategories = categories?.map((item) =>
      item.toDto(),
    ) as CategoryDto[];

    await this.redisService.cacheData(
      'findAllCategories',
      JSON.stringify(normalizedCategories),
      60 * 60 * 24,
    );

    return normalizedCategories;
  }

  async findOne(slug: string) {
    const category = await this.categoryRepository.findOne({
      filter: { slug },
      relations: ['media', 'tags', 'tags.image'],
    });

    if (!category) {
      throw new NotFoundException('category not founded');
    }

    return category.toDto();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { image, parent, ...rest } = updateCategoryDto;

    let imageId = null;
    let parentId = null;

    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });

      if (!media) {
        throw new NotFoundException('media not founded');
      }

      imageId = media.id;
    }

    if (parent) {
      const parentCategory = await this.categoryRepository.findOne({
        filter: {
          uuid: parent,
        },
      });

      if (!parentCategory) {
        throw new NotFoundException('parent category not founded');
      }

      parentId = parentCategory.id;
    }

    const category = await this.categoryRepository.update({
      filter: { id },
      updateData: {
        ...rest,
        ...(imageId ? { image: imageId } : {}),
        ...(parentId ? { parentId } : {}),
      },
      relations: ['media'],
    });

    if (!category) {
      throw new InternalServerErrorException('cant update category');
    }

    return category.toDto();
  }

  remove(id: number) {
    return this.categoryRepository.update({
      filter: { id },
      updateData: { deletedAt: new Date() },
    });
  }

  async findOneCategory(filter: FindOptionsWhere<CategoryEntity>) {
    return await this.categoryRepository.findOne({ filter });
  }

  async findCategory(filter: FindOptionsWhere<CategoryEntity>) {
    const { document, count: _ } = await this.categoryRepository.find({
      filter,
    });

    return document;
  }
  async findProductsByCategoryAndTag(categorySlug: string, tagSlug: string, paginationDto: PaginationDto) {
    const category = await this.categoryRepository.findOne({
      filter: { slug: categorySlug, tags: { slug: tagSlug } },
      relations: ['tags', 'tags.image'],
    });

    if (!category) { 
      throw new NotFoundException('category not founded');
    }

    const { products, totalCount } =
      await this.productService.findProductsByTagAndCategory(tagSlug, category.id, paginationDto);

    products.forEach((product: any) => {
      product.category = category;
      product.tags = category.tags;
    });

    return {
      products: products.map((product: any) => product.toDto()),
      totalCount,
    };
  }

  async getCategoryForSiteMap() {
    const { document: categories } = await this.categoryRepository.find({
      filter: { deletedAt: IsNull() },
      relations: ['media'],
      page:1,
      limit: 1000,
    });

    return categories.map((category) => category.toDto()) as CategoryDto[];
  }
}
