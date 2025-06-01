import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '../../constants/redis-client';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private cacheManager: RedisClientType | null,
  ) {
    this.checkErrors();
  }

  async cacheData(key: string, value: string, ttl: number): Promise<boolean> {
    const isRedisConnect = this.isConnect;

    if (isRedisConnect && this.cacheManager) {
      await this.cacheManager.set(key, value, { EX: ttl });
      return true;
    }

    return Promise.resolve(false);
  }

  async getCachedData(key: string): Promise<string | null> {
    const isRedisConnect = this.isConnect;

    if (isRedisConnect && this.cacheManager) {
      const data = await this.cacheManager.get(key);
      if (data) {
        return data;
      }
    }

    return Promise.resolve(null);
  }

  async deleteCachedData(key: string): Promise<boolean> {
    const isRedisConnect = this.isConnect;

    if (isRedisConnect && this.cacheManager) {
      await this.cacheManager.del(key);
      return true;
    }

    return Promise.resolve(false);
  }

  get isConnect() {
    return Boolean(this.cacheManager?.isOpen);
  }

  checkErrors() {
    const isRedisConnect = this.isConnect;

    if (isRedisConnect && this.cacheManager) {
      this.cacheManager.once('error', (error) => {
        console.error(error);
        this.cacheManager = null;
      });
    }
  }
}
