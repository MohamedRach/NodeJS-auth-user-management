import { Module } from '@nestjs/common';
import { UsersOfUserController } from './users-of-user.controller';
import { UsersOfUserService } from './users-of-user.service';
import { drizzleProvider } from 'src/drizzle/drizzle.provider';

@Module({
  controllers: [UsersOfUserController],
  providers: [UsersOfUserService, ...drizzleProvider],
  exports: [UsersOfUserService]
})
export class UsersOfUserModule {}
