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
@Controller('user')
export class UserController {
    constructor(private readonly service: UserService){}
    @Get('/users')
    async getUsers() {
        return this.service.getUsers()
    }
    @Post("/")
    async AddUser() {
        return this.service.AddUser()
    }
}
