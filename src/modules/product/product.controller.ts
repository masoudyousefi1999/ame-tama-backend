import { CreateProductDto } from './dto/create-product.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { Auth } from '../../decorators/http.decorators';
import { RoleType } from '../../constants/role-type';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UploadProductMediaDto } from './dto/upload-product-media.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { SearchDto } from './dto/search-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOkResponse({
    type: [ProductDto],
  })
  async getProducts(@Query() paginationDto: PaginationDto) {
    return await this.productService.getProducts(paginationDto);
  }

  @Get('/search')
  @ApiOkResponse({
    type: [ProductDto],
  })
  async searchProducts(@Query() SearchDto: SearchDto) {
    return await this.productService.searchProduct(SearchDto);
  }

  @Get('/similar/:productId')
  @ApiParam({ name: 'productId', required: true })
  @ApiOkResponse({
    type: [ProductDto],
  })
  async getSimilarProducts(
    @Param('productId', new ParseUUIDPipe()) productId: Uuid,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.productService.getSimilarProducts(
      productId,
      paginationDto,
    );
  }

  @Auth([RoleType.ADMIN])
  @Post()
  @ApiOkResponse({
    type: ProductDto,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiOkResponse({
    type: ProductDto,
  })
  async findOne(@Param('slug') slug: string) {
    return await this.productService.findOne(slug);
  }

  @Get('/category/:categorySlug')
  @ApiParam({ name: 'categorySlug', type: String, required: true })
  @ApiOkResponse({
    type: [ProductDto],
  })
  async findByCategory(
    @Param('categorySlug') categorySlug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.productService.findByCategory(
      categorySlug,
      paginationDto,
    );
  }

  @Post('/media')
  @ApiOkResponse({
    type: Boolean,
  })
  async uploadProductMedia(
    @Body() uploadProductMediaDto: UploadProductMediaDto,
  ) {
    return await this.productService.uploadProductMedia(uploadProductMediaDto);
  }

  @Patch(':uuid')
  @ApiParam({ name: 'uuid', type: String, required: true })
  @ApiOkResponse({
    type: ProductDto,
  })
  async updateProduct(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) productId: Uuid,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(productId, updateProductDto);
  }

  @Delete(':uuid')
  @ApiParam({ name: 'uuid', type: String, required: true })
  @ApiOkResponse({
    type: ProductDto,
  })
  async removeProduct(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) productId: Uuid,
  ) {
    return await this.productService.removeProduct(productId);
  }
}
