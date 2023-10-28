import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
    Body,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
  } from '@nestjs/common';
import { NewUser } from 'src/drizzle/schema';
@Controller('user')
export class UserController {
    constructor(private readonly service: UserService){}
    @Get('/users')
    async getUsers() {
        return this.service.getUsers()
    }
    @Post("/")
    async AddUser() {
        const user: NewUser = {
            firstName: "hamid",
            lastName: "momo",
            email: "hamid@gmail.com",
            password: "343536"
        }
        return this.service.AddUser(user)
    }
}
