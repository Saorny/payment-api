import { Injectable } from '@nestjs/common';
import { config } from '../../../config';
import {
  AppConfig,
  TypeOrmConfig,
  RedisConfig,
  MediaConfig,
  Logger,
  JwtConfig,
} from './interfaces/config.interface';

@Injectable()
export class ConfigService {
  public static get typeOrmConfig(): TypeOrmConfig {
    return config.database;
  }

  public static get appConfig(): AppConfig {
    return config.app;
  }

  public static get mediaConfig(): MediaConfig {
    return config.media;
  }

  public static get redisConfig(): RedisConfig {
    return config.redis;
  }

  static get logger(): Logger {
    return config.logger;
  }

  public static get jwtConfig(): JwtConfig {
    return config.jwt;
  }
}
