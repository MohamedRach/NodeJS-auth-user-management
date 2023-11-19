import { Controller, Get, Delete, Patch, Req, Body, Param, UseGuards, Post } from '@nestjs/common';
import { UsersOfUserService } from './users-of-user.service';
import { Request } from 'express';
import { NewUser, NewUserOfUser, UserOfUser } from 'src/drizzle/schema';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard(["jwt", "api-key"]))
@Controller('users')
export class UsersOfUserController {
    constructor(private userService: UsersOfUserService) {}
    @Get("/")
    async getAllUsers(@Req() req: Request) {
        //@ts-ignore
        return await this.userService.getUsers(req.user.id)
    }

    @Post("/")
    async AddUser(@Body() user: NewUserOfUser, @Req() req: Request) {
        //@ts-ignore
        return await this.userService.AddUser(user, req.user.id)
    }
    @Get('/:id')
    async findOne(@Req() req: Request, @Param("id") id: string) {
        
        //@ts-ignore
        return await this.userService.findOne(+id, req.user.id)
    }
    @Patch("/update/:id")
    async UpdateUser(@Param("id") id: number, @Body() user: NewUserOfUser) {
        return await this.userService.updateUser(user, id)
    }
    @Delete("/delete/:id")
    async DeleteUser(@Param("id") id: number) {
        //@ts-ignore
        return await this.userService.deleteUser(id)
    }
}
