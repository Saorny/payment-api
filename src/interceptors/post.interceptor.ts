import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PostInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return call$.pipe(
      map((content: any) => {
        if (response.statusCode === 201 && request.method === 'POST') {
          response.statusCode = HttpStatus.OK;
        }
        return content;
      }),
    );
  }
}
