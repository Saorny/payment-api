import { Injectable } from '@nestjs/common';
import { ConfigService } from '../shared/config/config.service';
import { RedisConfig } from '../shared/config/interfaces/config.interface';
import IORedis from 'ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  // private appLogger: AppLogger;
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    // this.appLogger = new AppLogger('', 'all', 'redis');
    this.redisClient = new IORedis(CacheService.config);
  }

  public async set(
    key: string,
    val: string,
    expireMode = 'Ex',
    time: number | string = CacheService.MPJwtTTl,
  ): Promise<any> {
    // this.appLogger.log(
    //   `Caching | Key ${key} | Value ${val} | Expire Mode ${expireMode} | Time ${time}`,
    // );
    return this.client.set(key, val, expireMode, time);
  }

  public flushall(): Promise<string> {
    // this.appLogger.log(`FLUSHALL`);
    return this.client.flushall();
  }

  public async sadd(
    prefix: string,
    setKey: string,
    value: string,
  ): Promise<number> {
    // this.appLogger.log(
    //   `Caching Set | Key ${prefix}_${setKey} | Value ${value}`,
    // );
    return this.client.sadd(`${prefix}-${setKey}`, value);
  }

  public async smembers(prefix: string, setKey: string): Promise<string[]> {
    return this.client.smembers(`${prefix}-${setKey}`);
  }

  public async sismember(
    prefix: string,
    setKey: string,
    openId: string,
  ): Promise<0 | 1> {
    return this.client.sismember(`${prefix}-${setKey}`, openId);
  }

  public async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  public getToken(): Promise<string | null> {
    return this.get('mp_token');
  }

  public storeToken(accessToken: string): Promise<any> {
    return this.set('mp_token', accessToken, 'Ex', CacheService.accessTokenTTL);
  }

  public get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public unset(key: string): Promise<number> {
    // this.appLogger.log(`unsetting ${key}`);
    return this.client.del(key);
  }

  private get client(): Redis {
    return this.redisClient;
  }

  private static get accessTokenTTL(): number {
    return this.config.accessTokenTTL;
  }

  private static get MPJwtTTl(): number {
    return this.config.mpJwtTTL;
  }

  private static get config(): RedisConfig {
    return ConfigService.redisConfig;
  }
}
