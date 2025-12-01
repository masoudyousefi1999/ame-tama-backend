import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto } from './dto/blog.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import type { UserEntity } from '../../modules/user/user.entity';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { RoleType } from '../../constants/role-type';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post()
  @Auth([])
  @ApiOkResponse({
    type: BlogDto,
  })
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @AuthUser() user: UserEntity,
  ) {
    return await this.blogService.createBlog(createBlogDto, user);
  }

  @Get()
  @ApiQuery({ name: 'paginationDto', type: PaginationDto })
  @ApiOkResponse({
    type: [BlogDto],
  })
  async getBlogs(@Query() paginationDto: PaginationDto) {
    return await this.blogService.getBlogs(paginationDto);
  }

  @Get(':slug')
  @ApiOkResponse({
    type: BlogDto,
  })
  async findOneBlogBySlug(@Param('slug') slug: string) {
    return await this.blogService.findOneBlogBySlug(slug);
  }

  @Patch(':uuid/publish')
  @ApiParam({ name: 'uuid', type: String, required: true })
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({
    type: BlogDto,
  })
  async togglePublishBlog(@Param('uuid') uuid: Uuid) {
    return await this.blogService.togglePublishBlog(uuid);
  }

  @Patch(':uuid')
  @ApiParam({ name: 'uuid', type: String, required: true })
  @Auth([])
  @ApiOkResponse({
    type: BlogDto,
  })
  async updateBlog(
    @Param('uuid') uuid: Uuid,
    @Body() updateBlogDto: UpdateBlogDto,
    @AuthUser() user: UserEntity,
  ) {
    return await this.blogService.updateBlog(uuid, updateBlogDto, user);
  }

  @Delete(':uuid')
  @ApiParam({ name: 'uuid', type: String, required: true })
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({
    type: Boolean,
  })
  async deleteBlog(@Param('uuid') uuid: Uuid) {
    return await this.blogService.deleteBlog(uuid);
  }

  @Post(':uuid/view-count')
  @ApiParam({ name: 'uuid', type: String, required: true })
  @ApiOkResponse({
    type: Number,
  })
  async getBlogViewCount(@Param('uuid') uuid: Uuid, @Req() request: Request) {
    return await this.blogService.updateBlogViewCount(uuid, request as any);
  }
}
