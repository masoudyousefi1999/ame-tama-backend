import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { Auth } from '../../decorators/http.decorators';
import { RoleType } from '../../constants/role-type';
import { ProductDto } from '../../modules/product/dto/product.dto';
import type { PaginationDto } from 'common/dto/pagination.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth([RoleType.ADMIN])
  @Post()
  @ApiOkResponse({
    type: CategoryDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({
    type: [CategoryDto],
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug/:tagSlug')
  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiParam({ name: 'tagSlug', type: String, required: true })
  @ApiOkResponse({
    type: [ProductDto],
  })
  findProductsByCategoryAndTag(
    @Param('slug') slug: string,
    @Param('tagSlug') tagSlug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.categoryService.findProductsByCategoryAndTag(slug, tagSlug, paginationDto);
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @Get(':slug')
  @ApiOkResponse({
    type: CategoryDto,
  })
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findOne(slug);
  }

  @Auth([RoleType.ADMIN])
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: CategoryDto,
  })
  update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Auth([RoleType.ADMIN])
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: CategoryDto,
  })
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.categoryService.remove(+id);
  }
}
