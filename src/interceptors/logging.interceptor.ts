/**
 * Logging interceptor.
 * @file 日志拦截器
 * @Module interceptor/logging
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { config } from '../config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle();
    if (config.mode !== 'develop') {
      return call$;
    }
    return call$.pipe(
      // tslint:disable-next-line:no-console
      tap(/*() => Logger.log( `${response.statusCode} --${Date.now() - now}ms`, '响应请求：---> ')*/),
    );
  }
}
