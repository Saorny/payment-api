import { CacheService } from '../cache/cache.service';
import { BaseService } from './base-service';

export abstract class Seeder<T> extends BaseService<T> {
  protected entityRepository;

  constructor(
    protected repository,
    logName?: string,
    logDir?: string,
    cacheService?: CacheService,
  ) {
    super(repository, logName, logDir, cacheService);
    this.entityRepository = repository;
  }

  public abstract seed(): Promise<T[]>;
  protected abstract init(): any;
}
