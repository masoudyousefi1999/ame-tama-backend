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
import { RedisService } from '../../shared/services/redis.service';
import type { ProductDto } from './dto/product.dto';
import { ModuleRef } from '@nestjs/core';
import { SeoService } from '../seo/seo.service';
import { SeoTypeEnum } from '../seo/seo-type.enum';

@Injectable()
export class ProductService {
  private categoryService!: CategoryService;
  constructor(
    private readonly moduleRef: ModuleRef,
    private productRepo: ProductRepository,
    private mediaService: MediaService,
    private productMediaRepo: ProductMediaRepository,
    private productDetailService: ProductDetailService,
    private redisService: RedisService,
    private seoService: SeoService,
  ) {}

  onModuleInit() {
    this.categoryService = this.moduleRef.get(CategoryService, {
      strict: false,
    });
  }

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
    const productCacheKey = `product:slug:${slug}`;
    const cachedProduct =
      await this.redisService.getCachedData(productCacheKey);

    if (cachedProduct) {
      return JSON.parse(cachedProduct);
    }

    const product = await this.findOneProduct({ slug }, [
      'detail',
      'category',
      'productMedia',
      'productMedia.media',
      'tags',
    ]);

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    const productSeo = await this.getProductSeo(product.id);

    product.seoMetadata = productSeo as any;

    const dto = product.toDto();

    // Cache for 1 hour
    const oneHourInSec = 60 * 60;
    await this.redisService.cacheData(
      productCacheKey,
      JSON.stringify(dto),
      oneHourInSec,
    );

    return dto;
  }

  async findOneByUuid(uuid: Uuid) {
    const product = await this.findOneProduct({ uuid }, [
      'detail',
      'category',
      'productMedia',
      'productMedia.media',
    ]);

    if (!product) {
      throw new NotFoundException('product not founded');
    }

    const productSeo = await this.getProductSeo(product.id);
    product.seoMetadata = productSeo as any;

    return product.toDto();
  }

  async findByCategory(categorySlug: string, paginationDto: PaginationDto) {
    // Try cache first
    const { page, limit } = paginationDto;
    const listCacheKey = `products:by-category:${categorySlug}:page-${page}-limit-${limit}`;
    const cachedList = await this.redisService.getCachedData(listCacheKey);
    if (cachedList) {
      return JSON.parse(cachedList);
    }

    const category = await this.categoryService.findOneCategory({
      slug: categorySlug,
    });

    if (!category) {
      throw new NotFoundException('category not founded');
    }

    const { document: products, count } = await this.productRepo.find({
      filter: {
        categoryId: category.id,
      },
      page: paginationDto.page,
      limit: paginationDto.limit,
      relations: ['productMedia', 'productMedia.media'],
      order: { inStock: 'desc', updatedAt: 'desc' },
    });

    const normalizedProducts = products.map((product) => {
      product.category = category;
      return product.toDto();
    });

    const response = { products: normalizedProducts, totalCount: count };

    // Cache for 1 hour
    const oneHourInSec = 60 * 60;
    await this.redisService.cacheData(
      listCacheKey,
      JSON.stringify(response),
      oneHourInSec,
    );

    return response;
  }

  async findOneProduct(
    filter: FindOptionsWhere<ProductEntity>,
    relations?:
      | FindOptionsRelationByString
      | FindOptionsRelations<ProductEntity>,
  ) {
    return await this.productRepo.findOne({
      filter: { ...filter },
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

    const productImageInfos = Array.isArray(infos) ? infos : [infos];

    await Promise.all(
      productImageInfos?.map(async (item) => {
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
            isDefault: isDefault || false,
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

      const payload: Record<string, any> = {};

      if (character) {
        payload.character = character;
      }
      if (series) {
        payload.series = series;
      }
      if (description) {
        payload.description = description;
      }
      if (specifications) {
        payload.specifications = specifications?.reduce(
          (acc, field) => ({ ...acc, [field.key]: field.value }),
          {} as Record<string, any>,
        );
      }

      const specObject = specifications?.reduce(
        (acc, field) => ({ ...acc, [field.key]: field.value }),
        {} as Record<string, any>,
      );

      const detail = await this.productDetailService.findOne(product.id);

      if (detail) {
        await this.productDetailService.update({
          productId: product.id,
          character,
          description,
          series,
          specifications: specObject,
        });
      } else {
        await this.productDetailService.create({
          productId: product.id,
          character,
          description,
          series,
          specifications: specObject,
        });
      }
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

  async getProducts(
    paginationDto: PaginationDto,
    isCacheEnabled: boolean = true,
  ): Promise<{ products: ProductDto[]; totalCount: number }> {
    const { limit, page } = paginationDto;

    if (isCacheEnabled) {
      const cachedData = await this.redisService.getCachedData(
        `getProducts-page-${page}-limit-${limit}`,
      );
      if (cachedData) return JSON.parse(cachedData);
    }

    const { document: products, count } = await this.productRepo.find({
      filter: { deletedAt: IsNull() },
      limit,
      page,
      relations: ['productMedia', 'productMedia.media', 'category', 'tags'],
      order: { inStock: 'desc', updatedAt: 'desc' },
    });

    const normalizedProducts = products.map((item) => {
      item.toDto();
      item.id = item.id as number;

      return item;
    }) as ProductDto[];

    const finalResponse = { products: normalizedProducts, totalCount: count };

    const oneHourInSec = 60 * 60 * 1;

    if (isCacheEnabled) {
      await this.redisService.cacheData(
        `getProducts-page-${page}-limit-${limit}`,
        JSON.stringify(finalResponse),
        oneHourInSec,
      );
    }

    return finalResponse;
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

    const normalizedSimilar = similarProducts.products?.map((item) =>
      item.toDto(),
    );

    return {
      products: normalizedSimilar,
      totalCount: similarProducts.totalCount,
    };
  }

  async findProductsByCategoryId(categoryId: number) {
    const { document: products } = await this.productRepo.find({
      filter: { categoryId },
    });

    return products;
  }

  async findProductsByTagAndCategory(
    tagSlug: string,
    categoryId: number,
    paginationDto: PaginationDto,
  ) {
    const { limit, page } = paginationDto;

    const { document: products, count } = await this.productRepo.find({
      filter: { categoryId, tags: { slug: tagSlug } },
      relations: ['productMedia', 'productMedia.media'],
      limit,
      page,
      order: { updatedAt: 'desc', inStock: 'desc' },
    });

    return { products: products, totalCount: count };
  }

  async findProductsByTag(tagSlug: string, paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const { document: products, count } = await this.productRepo.find({
      filter: { tags: { slug: tagSlug } },
      relations: ['productMedia', 'productMedia.media', 'category'],
      limit,
      page,
      order: { updatedAt: 'desc', inStock: 'desc' },
    });

    return { products: products, totalCount: count };
  }

  async getProductForSiteMap() {
    const { document: products } = await this.productRepo.find({
      filter: { deletedAt: IsNull() },
      relations: ['productMedia', 'productMedia.media', 'category', 'tags'],
      order: { updatedAt: 'desc', inStock: 'desc' },
      page: 1,
      limit: 1000,
    });

    return products.map((product) => product.toDto());
  }

  async getProductsForAi() {
    const { document: products } = await this.productRepo.find({
      filter: { deletedAt: IsNull(), inStock: true },
      relations: ['productMedia', 'productMedia.media', 'category', 'tags'],
      order: { updatedAt: 'desc', inStock: 'desc' },
      page: 1,
      limit: 1000,
    });

    const productDetails: any[] = [];

    products.forEach((product) => {
      const categorySlug = product?.category?.slug;
      const tagSlug = product?.tags?.[0]?.slug;

      productDetails.push({
        name: product.name,
        slug: product.slug,
        url: `https://ame-tama.com/${categorySlug}/${tagSlug}/${product.slug}`,
      });
    });

    return productDetails;
  }

  async getProductSeo(productId: number) {
    return await this.seoService.getSeo(SeoTypeEnum.PRODUCT, productId);
  }
}
