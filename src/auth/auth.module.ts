import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CacheModule } from '../modules/cache/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../modules/shared/shared.module';
import { ConfigService } from '../modules/shared/config/config.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    CacheModule,
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: () => ConfigService.jwtConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
