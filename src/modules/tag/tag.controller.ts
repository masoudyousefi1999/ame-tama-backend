import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { TagDto } from './dto/tag.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { RoleType } from '../../constants/role-type';
import { Auth } from '../../decorators/http.decorators';
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({
    type: TagDto,
  })
  async createTag(@Body() createTagDto: CreateTagDto) {
    console.log('create tag are calling -------------------------------->');
    return await this.tagService.createTag(createTagDto);
  }

  @Get()
  @ApiOkResponse({
    type: [TagDto],
  })
  async getTags(@Query() paginationDto: PaginationDto) {
    console.log('tag are calling -------------------------------->');
    const tags = await this.tagService.findAllTags(paginationDto);
    console.dir(tags, { depth: null });
    return tags;
  }



  @Get('uuid/:uuid')
  @ApiOkResponse({
    type: TagDto,
  })
  @ApiParam({ name: 'uuid', type: String, required: true })
  async findByUuid(@Param('uuid', ParseUUIDPipe) uuid: Uuid) {
    console.log('find by uuid are calling -------------------------------->');
    return await this.tagService.findOneTagByUuid(uuid);
  }

  @Patch(':uuid')
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({
    type: TagDto,
  })
  @ApiParam({ name: 'uuid', type: String, required: true })
  async updateTag(
    @Param('uuid', ParseUUIDPipe) uuid: Uuid,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    console.log('update tag are calling -------------------------------->');
    return await this.tagService.updateTag(uuid, updateTagDto);
  }
}
