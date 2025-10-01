import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { UserEntity } from '../../modules/user/user.entity';
import { Auth } from '../../decorators/http.decorators';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Auth([])
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @AuthUser() user: UserEntity,
  ) {
    return await this.commentService.create(createCommentDto, user);
  }

  @Get('last')
  @ApiQuery({ name: 'paginationDto', type: PaginationDto })
  async getLastComments(@Query('paginationDto') paginationDto: PaginationDto) {
    return this.commentService.getLastComments(paginationDto);
  }
  
  
  @Get(':productId')
  @ApiParam({ name: 'productId', type: String, required: true })
  async getComments(@Param('productId', new ParseUUIDPipe()) productId: Uuid) {
    return this.commentService.getComments(productId);
  }

}
