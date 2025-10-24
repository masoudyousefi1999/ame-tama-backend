import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { TagDto } from './dto/tag.dto';
import type { PaginationDto } from 'common/dto/pagination.dto';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  @ApiOkResponse({
    type: [TagDto],
  })
  async getTags(@Query() paginationDto: PaginationDto) {
    return await this.tagService.findAllTags(paginationDto);
  }

  @Get(':slug')
  @ApiOkResponse({
    type: TagDto,
  })
  @ApiParam({ name: 'slug', type: String, required: true })
  async findProductByTagSlug(
    @Param('slug') slug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.tagService.findProductByTagSlug(slug, paginationDto);
  }
}
