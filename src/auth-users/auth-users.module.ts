import { Module } from '@nestjs/common';
import { AuthUsersController } from './auth-users.controller';
import { AuthUsersService } from './auth-users.service';
import { UsersOfUserModule } from 'src/users-of-user/users-of-user.module';
import {PassportModule} from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
    UsersOfUserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'}
    }),
    PassportModule],
  controllers: [AuthUsersController],
  providers: [AuthUsersService],
  exports: [AuthUsersService]
})
export class AuthUsersModule {}
