import { Controller, Get, Delete, Patch, Req, Body, Param, UseGuards } from '@nestjs/common';
import { UsersOfUserService } from './users-of-user.service';
import { Request } from 'express';
import { NewUser } from 'src/drizzle/schema';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(ApiKeyAuthGuard, JwtAuthGuard)
@Controller('users')
export class UsersOfUserController {
    constructor(private userService: UsersOfUserService) {}
    @Get("/")
    async getAllUsers(@Req() req: Request) {
        //@ts-ignore
        return this.userService.getUsers(req.user.id)
    }
    @Get('/:email')
    async findOne(@Req() req: Request, @Param("email") email: string) {
        //@ts-ignore
        return this.userService.findOne(email, req.user.id)
    }
    @Patch("/update/:id")
    async UpdateUser(@Param("id") id: number, @Body() user: NewUser) {
        return this.userService.updateUser(user, id)
    }
    @Delete("/delete/:id")
    async DeleteUser(@Param("id") id: number) {
        //@ts-ignore
        return this.userService.deleteUser(id)
    }
}
