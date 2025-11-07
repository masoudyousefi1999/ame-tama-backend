import { Controller, Get, Param, Post } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { RoleType } from '../../constants/role-type';

@Controller('setting')
@ApiTags('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiOkResponse({
    type: [Object],
  })
  @Auth([RoleType.ADMIN])
  async getCachedData() {
    return await this.settingService.getCachedData();
  }

  @Post('delete-cached-data')
  @ApiOkResponse({
    type: [Object],
  })
  @Auth([RoleType.ADMIN])
  async deleteAllCachedData() {
    return await this.settingService.deleteAllCachedData();
  }

  @Post('delete-cached-data/:key')
  @ApiOkResponse({
    type: [Object],
  })
  @ApiParam({ name: 'key', type: String, required: true })
  @Auth([RoleType.ADMIN])
  async deleteCachedData(@Param('key') key: string) {
    return await this.settingService.deleteCachedData(key);
  }
}
