import { Controller, Get, Delete, Patch, Req, Body, Param, UseGuards, Post } from '@nestjs/common';
import { UsersOfUserService } from './users-of-user.service';
import { Request } from 'express';
import { NewUser, UserOfUser } from 'src/drizzle/schema';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard(["jwt", "api-key"]))
@Controller('users')
export class UsersOfUserController {
    constructor(private userService: UsersOfUserService) {}
    @Get("/")
    async getAllUsers(@Req() req: Request) {
        //@ts-ignore
        return this.userService.getUsers(req.user.id)
    }

    @Post("/")
    async AddUser(@Body() user: UserOfUser, @Req() req: Request) {
        //@ts-ignore
        return this.userService.AddUser(user, req.user.id)
    }
    @Get('/:id')
    async findOne(@Req() req: Request, @Param("id") id: string) {
        //@ts-ignore
        return this.userService.findOne(+id, req.user.id)
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
