import { Inject, Injectable } from '@nestjs/common';
import { type RedisClientType } from 'redis';

@Injectable()
export class RedisService {

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async zRangeList(key: string, start: number = 0, stop: number = -1) {
    return await this.redisClient.zRange(key, start, stop, {
      REV: true,
    });
  }

  async zAdd(key: string, members: Record<string, number>) {
    const formattedMembers = Object.entries(members).map(([member, score]) => ({ score, value: member }));
    await this.redisClient.zAdd(key, formattedMembers);
  }
}
