import { Injectable } from '@nestjs/common';
import { RedisService } from '../../shared/services/redis.service';

@Injectable()
export class SettingService {
  constructor(private redisService: RedisService) {}

  async getCachedData() {
    const allData = await this.redisService.getAllCachedData();
    return allData;
  }

  async deleteCachedData(key: string) {
    try {
      await this.redisService.deleteCachedData(key);

      return true;
    } catch (error) {
      return true;
    }
  }

  async deleteAllCachedData() {
    try {
      await this.redisService.deleteAllCachedData();

      return true;
    } catch (error) {
      return true;
    }
  }
}
