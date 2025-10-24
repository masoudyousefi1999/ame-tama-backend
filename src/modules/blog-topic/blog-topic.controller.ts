import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogTopicService } from './blog-topic.service';
import { BlogTopicDto } from './dto/blog-topic.dto';
import { CreateBlogTopicDto } from './dto/create-blog-topic.dto';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decorators/http.decorators';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateBlogTopicDto } from './dto/update-blog-topic.dto';

@Controller('blog-topic')
export class BlogTopicController {
  constructor(private readonly blogTopicService: BlogTopicService) {}

  @Auth([RoleType.ADMIN])
  @Post()
  @ApiOkResponse({
    type: BlogTopicDto,
  })
  async createBlogTopic(
    @Body() createBlogTopicDto: CreateBlogTopicDto,
  ): Promise<BlogTopicDto> {
    return await this.blogTopicService.createBlogTopic(createBlogTopicDto);
  }

  @Get()
  @ApiOkResponse({
    type: [BlogTopicDto],
  })
  async getBlogTopics(@Query() paginationDto: PaginationDto) {
    return await this.blogTopicService.getBlogTopics(paginationDto);
  }

  @Get(':slug')
  @ApiOkResponse({
    type: BlogTopicDto,
  })
  @ApiParam({ name: 'slug', type: 'string', required: true })
  async getBlogTopic(@Param('slug') slug: string): Promise<BlogTopicDto> {
    return await this.blogTopicService.getBlogTopic({ slug });
  }

  @Auth([RoleType.ADMIN])
  @Patch(':uuid')
  @ApiParam({ name: 'uuid', type: 'string', required: true })
  @ApiOkResponse({
    type: BlogTopicDto,
  })
  async updateBlogTopic(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: Uuid,
    @Body() updateBlogTopicDto: UpdateBlogTopicDto,
  ): Promise<BlogTopicDto> {
    return await this.blogTopicService.updateBlogTopic(
      uuid,
      updateBlogTopicDto,
    );
  }

  @Auth([RoleType.ADMIN])
  @Delete(':uuid')
  @ApiParam({ name: 'uuid', type: 'string', required: true })
  @ApiOkResponse({
    type: Boolean,
  })
  async deleteBlogTopic(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: Uuid,
  ): Promise<boolean> {
    return await this.blogTopicService.deleteBlogTopic(uuid);
  }
}
