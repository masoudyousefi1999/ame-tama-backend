import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ArtWorkService } from './art-work.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateArtWorkDto } from './dto/create-art-work.dto';
import { ArtWorkDto } from './dto/article.dto';
import { UserEntity } from '../user/user.entity';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ReactToArtWorkDto } from './dto/reaction-to-art-work.dto';

@ApiTags('Art Work')
@Controller('art-work')
export class ArtWorkController {
  constructor(private artWorkService: ArtWorkService) {}

  @Post()
  @ApiOperation({ summary: 'Create Art Work' })
  @ApiOkResponse({ type: ArtWorkDto })
  @Auth([])
  async createArtWork(
    @Body() createArtWorkDto: CreateArtWorkDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.artWorkService.createArtWork(createArtWorkDto, user);
  }

  @Get()
  @ApiQuery({ name: 'paginationDto', type: PaginationDto })
  @ApiOkResponse({ type: [ArtWorkDto] })
  async getArtWorks(@Query() paginationDto: PaginationDto) {
    return this.artWorkService.getArtWorks(paginationDto);
  }

  @Get(':uuid')
  @ApiOkResponse({ type: ArtWorkDto })
  @ApiParam({ name: 'uuid', type: String })
  async getArtWork(@Param('uuid', ParseUUIDPipe) uuid: Uuid) {
    return this.artWorkService.getArtWork(uuid);
  }

  @Get(':uuid/reaction')
  @ApiOkResponse({ type: ArtWorkDto })
  @ApiParam({ name: 'uuid', type: String })
  @Auth([])
  async getArtWorkReaction(
    @Param('uuid', ParseUUIDPipe) uuid: Uuid,
    @AuthUser() user: UserEntity,
  ) {
    return this.artWorkService.getArtWorkReaction(uuid, user);
  }

  @Post(':uuid/watch')
  @ApiOkResponse({ type: ArtWorkDto })
  @ApiParam({ name: 'uuid', type: String })
  async watchArtWork(
    @Param('uuid', ParseUUIDPipe) uuid: Uuid,
    @Req() request: Request,
  ) {
    const data = await this.artWorkService.watchArtWork(uuid, request as any);

    return data || { message: null };
  }

  @Post(':uuid/react')
  @ApiOkResponse({ type: String })
  @ApiParam({ name: 'uuid', type: String })
  @Auth([])
  async reactToArtWork(
    @Param('uuid', ParseUUIDPipe) uuid: Uuid,
    @AuthUser() user: UserEntity,
    @Body() reactionDto: ReactToArtWorkDto,
  ) {
    return this.artWorkService.reactToArtWork(uuid, user, reactionDto);
  }
}
