import { Body, Controller, Post } from '@nestjs/common';
import { SeoService } from './seo.service';
import type { CreateSeoDto } from './dto/create-seo.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SeoDto } from './dto/seo.dto';
import { Auth } from '../../decorators/http.decorators';
import { RoleType } from '../../constants/role-type';

@Controller('seo')
@ApiTags('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post()
  @ApiOkResponse({
    type: SeoDto,
  })
  @Auth([RoleType.ADMIN])
  createSeo(@Body() createSeoDto: CreateSeoDto) {
    return this.seoService.createSeo(createSeoDto);
  }
}
