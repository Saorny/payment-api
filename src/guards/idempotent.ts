import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserErrors } from 'src/errors/customer';
import { CacheService } from 'src/modules/cache/cache.service';

@Injectable()
export class IdemPotentGuard {
  constructor(protected readonly cacheService: CacheService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idemPotentToken = request.headers['x-idempotent'] || '';
    const value = await this.cacheService.get(idemPotentToken);

    if (!value) {
      await this.cacheService.set(idemPotentToken, '1');
      return true;
    }
    throw new UnauthorizedException(UserErrors.DUPPLICATE_REQUEST);
    return false;
  }
}
