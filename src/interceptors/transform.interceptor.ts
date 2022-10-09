import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Response<T> {
  data: T | any | [];
  resultCode?: number;
  resultMsg?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T> | string | boolean> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T> | string | boolean> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return {
            data: {},
            resultCode: 0,
            resultMsg: '请求成功',
          };
        }
        if (typeof data === 'boolean' || typeof data === 'string') {
          return data;
        }
        if (data && 'resultMsg' in data) {
          data = Object.assign({}, data);

          return {
            data: [],
            ...data,
            resultCode: 0,
          };
        }
        return {
          data,
          resultCode: 0,
          resultMsg: '请求成功',
        };
      }),
    );
  }
}
