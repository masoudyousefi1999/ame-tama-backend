import { PaginationDto } from './../../common/dto/pagination.dto';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { SendChatDto } from './dto/send-chat.dto';
import { type Response } from 'express';
import { AuthUser } from '../../decorators/auth-user.decorator';
import type { UserEntity } from '../../modules/user/user.entity';
import { Auth } from '../../decorators/http.decorators';
import { CreateFinanceDto } from './dto/create-finance.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @Auth([])
  async addFinance(
    @Body() createFinanceDto: CreateFinanceDto,
    @AuthUser() user: UserEntity,
  ) {
    return await this.financeService.addFinance(createFinanceDto, user);
  }

  @Get()
  @Auth([])
  async getFinance(
    @AuthUser() user: UserEntity,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.financeService.getFinances(user, paginationDto);
  }

  @Post('/chat')
  @Auth([])
  async chat(
    @Body() sendChatDto: SendChatDto,
    @Res() res: Response,
    @AuthUser() user: UserEntity,
  ) {
    const { message } = sendChatDto;
    return await this.financeService.chat(message, res, user);
  }

  @Get('tip')
  @Auth([])
  async getTip(@Res() res: Response, @AuthUser() user: UserEntity) {
    return await this.financeService.getTip(res, user);
  }

  @Post('/generate')
  @Auth([])
  async generateFinance(
    @Body() sendChatDto: SendChatDto,
    @Res() res: Response,
  ) {
    const { message } = sendChatDto;
    return await this.financeService.generateFinance(message, res);
  }
}
