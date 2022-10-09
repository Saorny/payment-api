import { AppLogger } from '../shared/service/applogger.service';
import { CacheService } from '../cache/cache.service';
import {
  Brackets,
  SelectQueryBuilder,
  UpdateResult,
  WhereExpression,
} from 'typeorm';
import {
  OrConditionList,
  WhereCondition,
  AndConditionList,
} from './common.interface';

export abstract class BaseService<T> {
  protected repository;
  protected logger: AppLogger;
  protected cacheService?: CacheService;

  constructor(
    protected entityRepository,
    logName?: string,
    logDir?: string,
    cacheService?: CacheService,
  ) {
    this.repository = entityRepository;
    this.logger = new AppLogger('', logName, logDir);
    this.cacheService = cacheService;
  }

  public softDelete(entityId: string, extra?: any): Promise<UpdateResult> {
    const update = Object.assign(
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      extra,
    );

    return this.repository.update(entityId, update);
  }

  public async calculateNumberOf(
    where: Array<WhereCondition | OrConditionList>,
    from: string,
    distinct?: string,
  ): Promise<number> {
    const query = this.repository.createQueryBuilder(from);
    let res;

    query.where(
      new Brackets((subQuery) => {
        this.applyAndConditionList(subQuery, where);
      }),
    );
    if (distinct) {
      res = await query
        .select(`COUNT(DISTINCT(${distinct})) as nb`)
        .getRawOne();
      return res.nb;
    } else {
      return query.getCount();
    }
  }

  public async calculateNumberOfThrough(
    where: Array<WhereCondition | OrConditionList>,
    aggregate: string,
    distinct?: string,
  ): Promise<number> {
    const query = this.repository
      .createQueryBuilder('a')
      .leftJoin(`a.${aggregate}`, 'b');
    let res;

    query.where(
      new Brackets((subQuery) => {
        this.applyAndConditionList(subQuery, where);
      }),
    );
    if (distinct) {
      res = await query
        .select(`COUNT(DISTINCT(${distinct})) as nb`)
        .getRawOne();
      return res.nb;
    } else {
      return query.getCount();
    }
  }

  protected restoreIfNessary(item?: any): Promise<T> | T {
    if (item && item.isDeleted) {
      item.isDeleted = false;
      item.deletedAt = null;
      // this.logger.log(`Restoring ${item.constructor.name} ${item.id}`);
      return this.save(item);
    }
    return item;
  }

  protected applyAndConditionList(
    query: WhereExpression,
    conditionSet: Array<WhereCondition | OrConditionList>,
  ): void {
    conditionSet.forEach(
      (line: WhereCondition | OrConditionList, i: number) => {
        const action =
          i === 0 ? query.where.bind(query) : query.andWhere.bind(query);

        if (BaseService.isOrList(line)) {
          const list = line as OrConditionList;

          action(
            new Brackets((subQuery) => {
              this.applyOrConditionList(subQuery, list.anyOf);
            }),
          );
        } else {
          const cond = line as WhereCondition;

          action(cond.cond, cond.params);
        }
      },
    );
  }

  protected applyOrConditionList(
    query: WhereExpression,
    list: Array<WhereCondition | AndConditionList>,
  ): void {
    list.forEach((line: WhereCondition | AndConditionList, i: number) => {
      const action =
        i === 0 ? query.where.bind(query) : query.orWhere.bind(query);

      if (BaseService.isAndList(line)) {
        const conditionSet = line as AndConditionList;

        action(
          new Brackets((subQuery) => {
            this.applyAndConditionList(subQuery, conditionSet.allOf);
          }),
        );
      } else {
        const cond = line as WhereCondition;

        action(cond.cond, cond.params);
      }
    });
  }

  protected static isOrList(line: WhereCondition | OrConditionList): boolean {
    return Object.keys(line).includes('anyOf');
  }

  protected static isAndList(line: WhereCondition | AndConditionList): boolean {
    return Object.keys(line).includes('allOf');
  }

  protected async searchOne(
    where: any,
    relations?: string[],
    cacheKey?: string,
    duration?: number,
  ): Promise<T | null | undefined> {
    try {
      const res = await (cacheKey && this.mayCache(cacheKey)
        ? this.findOneAndCache(cacheKey, where, relations, duration)
        : this.repository.findOne({ where, relations }));
      return res as T;
    } catch (e) {
      // this.logger.error(
      //   `Cannot find entity: ${JSON.stringify(
      //     where,
      //   )} | relations ${JSON.stringify(relations)}`,
      // );
      return null;
    }
  }

  protected async search(
    options: any,
    cacheKey?: string,
    duration?: number,
  ): Promise<T[]> {
    try {
      const res = await (cacheKey && this.mayCache(cacheKey)
        ? this.findAndCache(cacheKey, options, duration)
        : this.repository.find(options));
      return res as T[];
    } catch (e) {
      // this.logger.error(
      //   `An error happened whilst searching | ${JSON.stringify(e)}`,
      // );
      return [];
    }
  }

  private mayCache(cacheKey?: string | undefined | null): boolean {
    return (cacheKey && this.cacheService !== null) || false;
  }

  private async findOneAndCache(
    cacheKey: string,
    where: any,
    relations?: string[],
    duration?: number,
  ): Promise<string | null | undefined> {
    let res = await this.cacheService?.get(cacheKey);

    if (!res) {
      res = (await this.repository.findOne({ where, relations })) as
        | string
        | null
        | undefined;
      if (res) {
        await this.cacheService?.set(
          cacheKey,
          JSON.stringify(res),
          'Ex',
          duration,
        );
      }
    } else {
      res = JSON.parse(res);
    }
    return res;
  }

  private async findAndCache(
    cacheKey: string,
    options: any,
    duration?: number,
  ): Promise<string | undefined | null> {
    let res = await this.cacheService?.get(cacheKey);

    if (!res || res?.length) {
      const tmp = (await this.repository.find(options)) as any;

      res = tmp;
      if (res && res.length > 0) {
        await this.cacheService?.set(
          cacheKey,
          JSON.stringify(res),
          'Ex',
          duration,
        );
      }
    } else {
      if (res) {
        res = JSON.parse(res);
      }
    }
    return res;
  }

  protected async runQuery(
    query: SelectQueryBuilder<any>,
    fct: string,
    cacheKey?: string,
    duration?: number,
  ): Promise<any> {
    try {
      return cacheKey && this.mayCache(cacheKey)
        ? this.runQueryAndCache(cacheKey, query, fct, duration)
        : query[fct]();
    } catch (e) {
      // this.logger.error(
      //   `An error happened whilst running query | Details ${JSON.stringify(
      //     e.message,
      //   )}`,
      // );
      return [];
    }
  }

  private async runQueryAndCache(
    cacheKey: string,
    query: SelectQueryBuilder<any>,
    fct: string,
    duration?: number,
  ): Promise<string | undefined | null> {
    let res = await this.cacheService?.get(cacheKey);

    if (!res) {
      res = await query[fct]();
      await this.cacheService?.set(
        cacheKey,
        JSON.stringify(res),
        'Ex',
        duration,
      );
    } else {
      res = JSON.parse(res);
    }
    return res;
  }

  protected async all(): Promise<T[]> {
    try {
      const where = {
        isDeleted: false,
      };

      return this.repository.find({ where });
    } catch (e) {
      // this.logger.error(`An error occurred whilst searching all`);
      return [];
    }
  }

  protected findAndSelect(where, select): Promise<T[]> | null {
    try {
      return this.repository.find({
        where,
        select,
      });
    } catch (e) {
      // this.logger.error(`An error occurred whilst find all`);
      return null;
    }
  }

  protected save(data: any): any | Promise<T> | Promise<T[]> {
    try {
      return this.repository.save(data);
    } catch (e) {
      // this.logger.error(`An error happened whilst inserting new entity`);
      return null;
    }
  }

  protected remove(data: T[]): any | Promise<T> | Promise<T[]> {
    try {
      return this.repository.remove(data);
    } catch (e) {
      // this.logger.error(`An error happened whilst removing entity`);
      return null;
    }
  }

  protected update(where: any, updates: any): Promise<UpdateResult> | null {
    try {
      return this.repository.update(where, updates);
    } catch (e) {
      // this.logger.error(
      //   `An error happened whilst updating entity | Where ${JSON.stringify(
      //     where,
      //   )} | Updates ${JSON.stringify(updates)} | Details ${JSON.stringify(e)}`,
      // );
      return null;
    }
  }

  protected updateOne(
    entityId: string,
    updates: any,
  ): Promise<UpdateResult> | null {
    try {
      return this.repository.update(entityId, updates);
    } catch (e) {
      // this.logger.error(
      //   `An error happened whilst updating one entity | entityId ${entityId} | Updates ${JSON.stringify(
      //     e.message,
      //   )}`,
      // );
      return null;
    }
  }

  public async count(
    conditions?: any,
    cacheKey?: string,
    duration?: number,
  ): Promise<number> {
    try {
      return cacheKey && this.mayCache(cacheKey)
        ? Number(await this.countAndCache(cacheKey, conditions, duration))
        : this.repository.count(conditions);
    } catch (e) {
      // this.logger.error(
      //   `An error happened whilst counting one entity | Details ${JSON.stringify(
      //     e.message,
      //   )}`,
      // );
      return 0;
    }
  }

  protected async countAndCache(
    cacheKey: string,
    options: any,
    duration?: number,
  ): Promise<number | null | undefined> {
    let res = await this.cacheService?.get(cacheKey);

    if (!res) {
      const tmp = (await this.repository.count(options)) as any;

      res = tmp;
      await this.cacheService?.set(
        cacheKey,
        JSON.stringify(res),
        'Ex',
        duration,
      );
    } else {
      res = JSON.parse(res);
    }
    return Number(res);
  }

  protected async findAndCount(options): Promise<[T[], number]> {
    try {
      return this.repository.findAndCount(options);
    } catch (e) {
      // this.logger.error(
      //   `An error happened whilst finding and counting | Details ${JSON.stringify(
      //     e.message,
      //   )}`,
      // );
      return [[], 0];
    }
  }
}
