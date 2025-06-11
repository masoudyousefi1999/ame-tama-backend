import { PaginationDto } from './../../common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { CategoryService } from '../../modules/category/category.service';
import type { CategoryEntity } from '../../modules/category/entity/category.entity';
import type { ProductEntity } from './entity/product.entity';
import {
  In,
  IsNull,
  type FindOptionsRelationByString,
  type FindOptionsRelations,
  type FindOptionsWhere,
} from 'typeorm';
import type { UploadProductMediaDto } from './dto/upload-product-media.dto';
import { MediaService } from '../../modules/media/media.service';
import { ProductMediaRepository } from './repository/product-media.repository';
import type { UpdateProductDto } from './dto/update-product.dto';
import { ProductDetailService } from './../../modules/product-detail/product-detail.service';
import type { SearchDto } from './dto/search-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private categoryService: CategoryService,
    private mediaService: MediaService,
    private productMediaRepo: ProductMediaRepository,
    private productDetailService: ProductDetailService,
  ) {}

  async create(CreateProductDto: CreateProductDto) {
    const { category, productDetail, ...rest } = CreateProductDto;

    let categoryId = null;
    let currentCategory: CategoryEntity | null;

    if (category) {
      currentCategory = await this.categoryService.findOneCategory({
        uuid: category,
      });

      if (!currentCategory) {
        throw new NotFoundException('category not founded');
      }

      categoryId = currentCategory.id;
    } else {
      throw new BadRequestException('please send category id.');
    }

    const product = await this.productRepo.create({
      ...rest,
      categoryId,
    });

    const { character, series, description, specifications } = productDetail;

    const specObject = specifications?.reduce(
      (acc, field) => ({ ...acc, [field.key]: field.value }),
      {} as Record<string, any>,
    );

    const newProductDetail = await this.productDetailService.create({
      character,
      productId: product.id,
      series,
      description,
      specifications: specObject,
    });

    product.category = currentCategory;
    product.detail = newProductDetail;

    return product.toDto();
  }

  async findOne(slug: string) {
    const product = await this.findOneProduct({ slug }, [
      'detail',
      'category',
      'productMedia',
      'productMedia.media',
    ]);

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    return product.toDto();
  }

  async findByCategory(categorySlug: string, paginationDto: PaginationDto) {
    const category = await this.categoryService.findOneCategory({
      slug: categorySlug,
    });

    if (!category) {
      throw new NotFoundException('category not founded');
    }

    const children = await this.categoryService.findCategory({
      parentId: category.id,
    });

    const categoryIds = [category.id];

    if (children.length > 0) {
      children.forEach((item) => {
        categoryIds.push(item.id);
      });
    }

    const products = await this.productRepo.find({
      filter: {
        categoryId: In(categoryIds),
      },
      page: paginationDto.page,
      limit: paginationDto.limit,
      relations: ['productMedia', 'productMedia.media'],
    });

    return products.map((product) => {
      product.category = category;
      return product.toDto();
    });
  }

  async findOneProduct(
    filter: FindOptionsWhere<ProductEntity>,
    relations?:
      | FindOptionsRelationByString
      | FindOptionsRelations<ProductEntity>,
  ) {
    return await this.productRepo.findOne({
      filter: { inStock: true, ...filter },
      relations,
    });
  }

  async uploadProductMedia(uploadProductMediaDto: UploadProductMediaDto) {
    const { productId, infos } = uploadProductMediaDto;

    const product = await this.productRepo.findOne({
      filter: { uuid: productId },
    });

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    const metaData: {
      productId: number;
      infos: { isDefault: boolean; mediaId: number; order: number }[];
    } = {
      productId: product.id,
      infos: [],
    };

    await Promise.all(
      infos?.map(async (item) => {
        const { mediaId, order, isDefault = false } = item;
        try {
          const media = await this.mediaService.getMedia({
            uuid: item.mediaId,
          });

          if (!media) {
            throw new NotFoundException(
              `media not founded with id: ${mediaId}`,
            );
          }

          metaData.infos.push({
            isDefault,
            mediaId: media.id,
            order,
          });
        } catch (error) {
          console.log((error as any)?.message);
        }
      }),
    );

    await this.productMediaRepo.create(metaData);

    return true;
  }

  async updateProduct(productId: Uuid, updateProductDto: UpdateProductDto) {
    const { category, productDetail, ...restUpdateData } = updateProductDto;
    const product = await this.findOneProduct({ uuid: productId });

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    let categoryId = null;

    if (category) {
      const currentCategory = await this.categoryService.findOneCategory({
        uuid: category,
      });

      if (!currentCategory) {
        throw new NotFoundException('category not founded');
      }

      categoryId = currentCategory.id;
    }
    if (productDetail) {
      let { character, series, description, specifications } = productDetail;

      const specObject = specifications?.reduce(
        (acc, field) => ({ ...acc, [field.key]: field.value }),
        {} as Record<string, any>,
      );

      await this.productDetailService.update({
        productId: product.id,
        character,
        description,
        series,
        specifications: specObject,
      });
    }

    const updated = await this.productRepo.update({
      filter: { id: product.id },
      updateData: {
        ...restUpdateData,
        ...(categoryId ? { categoryId: categoryId } : {}),
      },
      relations: ['detail'],
    });

    return updated?.toDto();
  }

  async removeProduct(productId: Uuid) {
    const product = await this.findOneProduct({ uuid: productId });

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    const updated = await this.productRepo.update({
      filter: { id: product.id },
      updateData: { deletedAt: new Date() },
    });

    return updated?.toDto();
  }

  async searchProduct(searchDto: SearchDto) {
    const { limit, page, search } = searchDto;
    const products = await this.productRepo.searchProduct(search, page, limit);

    return products.data.map((item) => item.toDto());
  }

  async getProducts(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const products = await this.productRepo.find({
      filter: { deletedAt: IsNull() },
      limit,
      page,
      relations: ['productMedia', 'productMedia.media', 'category'],
      order: { updatedAt: 'desc' },
    });

    return products.map((item) => item.toDto());
  }

  async getSimilarProducts(productId: Uuid, paginationDto: PaginationDto) {
    const currentProduct = await this.productRepo.findOne({
      filter: { uuid: productId },
    });

    if (!currentProduct) {
      throw new NotFoundException('product not founded');
    }

    const similarProducts = await this.productRepo.getSimilarProduct({
      currentProduct,
      ...paginationDto,
    });

    return similarProducts.data?.map((item) => item.toDto());
  }
}
