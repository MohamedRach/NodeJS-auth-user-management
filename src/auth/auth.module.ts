import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiKeyStrategy } from './strategy/apikey.strategy';
import {PassportModule} from '@nestjs/passport'
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'}
    }),
    PassportModule],
  providers: [AuthService, ApiKeyStrategy],
  exports: [AuthService]
})
export class AuthModule {}
