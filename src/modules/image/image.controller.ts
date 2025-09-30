import { Controller, Get, Query, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import type { GetImageDto } from './dto/get-image.dto';
import type { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get()
  async getImage(@Query() query: GetImageDto, @Res() res: Response) {
    return await this.imageService.getImage(query, res);
  }
}
