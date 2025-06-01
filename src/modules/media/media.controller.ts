import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { ApiFile } from '../../decorators/swagger.schema';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MediaDto } from './dtos/media.dto';
import { CreateMediaDto } from './dtos/create-media.dto';
import { MediaService } from './media.service';
import type { IFile } from 'interfaces/IFile';

@ApiTags('upload')
@Controller('upload')
export class MediaController {
  constructor(private mediaService: MediaService) {}
  @Post()
  @ApiFile({ name: 'file' })
  @ApiResponse({ type: MediaDto })
  async uploadFile(
    @UploadedFile() file: IFile,
    @Body() createMediaDto: CreateMediaDto,
  ) {
    const media = await this.mediaService.uploadFile(file, createMediaDto);

    return media.toDto();
  }
}
