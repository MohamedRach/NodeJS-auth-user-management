import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { drizzleProvider } from 'src/drizzle/drizzle.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, ...drizzleProvider]
})
export class UserModule {}
