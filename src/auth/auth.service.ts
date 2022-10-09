import { Injectable } from '@nestjs/common';
import { CacheService } from '../modules/cache/cache.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCustomer } from './data.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    protected readonly cacheService: CacheService,
  ) {}

  public async generateCustomerToken(
    email: string,
    customerId: string,
  ): Promise<string> {
    const payload = {
      type: 'customer',
      email,
      customerId,
    } as AuthCustomer;

    return this.jwtService.sign(payload);
  }
}
