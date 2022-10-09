import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../modules/shared/config/config.service';
import { AuthService } from './auth.service';
import { AuthCustomer } from './data.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: ConfigService.jwtConfig.secret,
    });
  }

  public async validate(payload: any): Promise<AuthCustomer | null> {
    if (payload.type === 'customer') {
      return this.validateCustomerLogin(payload);
    }
    return null;
  }

  private async validateCustomerLogin(
    payload: any,
  ): Promise<AuthCustomer | null> {
    return {
      type: payload.type,
      email: payload.email,
      customerId: payload.customerId,
    };
  }
}
