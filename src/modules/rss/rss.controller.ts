import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RssService } from './rss.service';
import { AddNewsDto } from './dto/add-news-dto';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';

@Controller('rss')
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Post('add-news')
  @ApiOkResponse({
    type: 'boolean',
  })
  async addNews(@Body() addNewsDto: AddNewsDto) {
    return await this.rssService.addNews(addNewsDto);
  }

  @Get('is-rss-exists/:url')
  @ApiParam({ name: 'url', type: String, required: true })
  @ApiOkResponse({
    type: 'boolean',
  })
  async isRssExists(@Param('url') url: string) {
    return await this.rssService.findOneRss(url);
  }
}
