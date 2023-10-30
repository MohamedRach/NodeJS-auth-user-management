import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { AuthUsersModule } from './auth-users/auth-users.module';
import { UsersOfUserModule } from './users-of-user/users-of-user.module';

@Module({
  imports: [DrizzleModule, UserModule, ConfigModule.forRoot(), AuthModule, AuthUsersModule, UsersOfUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
