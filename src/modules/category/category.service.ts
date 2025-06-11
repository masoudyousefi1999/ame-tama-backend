import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { MediaService } from '../../modules/media/media.service';
import { type FindOptionsWhere } from 'typeorm';
import type { CategoryEntity } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private mediaService: MediaService,
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

  async findAll() {
    const categories = await this.categoryRepository.findAll();

    return categories?.map((item) => item.toDto());
  }

  async findOne(slug: string) {
    const category = await this.categoryRepository.findOne({
      filter: { slug },
      relations: ['media', 'children', 'children.media', 'parent'],
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
    return await this.categoryRepository.find({ filter });
  }
}
