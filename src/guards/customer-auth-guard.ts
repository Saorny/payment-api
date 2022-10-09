import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserErrors } from '../errors/customer';
import { AppLogger } from '../modules/shared/service/applogger.service';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const logger = new AppLogger('', 'user-incoming', 'request');
    const request = context.switchToHttp().getRequest();
    const payload = request.user;
    const isUser = payload.type === 'customer';

    if (!isUser) {
      throw new UnauthorizedException(UserErrors.ONLY_FOR_CUSTOMER);
    }
    logger.log(`Incoming ${request.headers['x-forwarded-for']} \
    | User ${payload.openId} | Name ${
      (payload.nickName && payload.user.nickName) || 'Unidentified'
    } \
    | host ${request.headers.host} | ${request.method} ${
      request.path
    } ${JSON.stringify(request.query)} \
    | Body ${JSON.stringify(request.body)}`);
    return true;
  }
}
