import { Controller, Post, Res, Body, Get, Req, UseGuards, Query } from '@nestjs/common';
import {Response, Request} from 'express'
import { AuthUsersService } from './auth-users.service';
import { NewUserOfUser, User } from 'src/drizzle/schema';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';
type login = {
    username: string,
    password: string
}
//@UseGuards(ApiKeyAuthGuard)
@Controller('auth-users')
export class AuthUsersController {
    constructor(private authUserService: AuthUsersService) {}
    @Post('/signUp?')
    signUp(@Body() user: NewUserOfUser, @Res({passthrough: true}) response: Response, @Query("redirect") redirectUrl: string, @Req() request: Request) {
        //@ts-ignore
        const jwt = this.authUserService.signup(user, request.user.id)
        response.cookie('jwt', jwt, {httpOnly: true, domain: "localhost",});
        response.redirect(redirectUrl)
    }

    @Post('/login?')
    login(@Body() user: login,@Query("redirect") redirectUrl: string, @Res() response: Response, @Req() request: Request) {
        //const id = request;
        //@ts-ignore
        const jwt = this.authUserService.login(user.username, user.password, request.user.id)
        response.cookie('jwt', jwt, {httpOnly: true, domain: "localhost",});
        response.redirect(redirectUrl)
    }
    @Get("/google/signup")
    googleSignUp(@Res() res: Response) {
        const url = this.authUserService.getGoogleAuthURL();
        res.redirect(url)
    }

    @Get("/api/sessions/oauth/google?")
    redirect(@Req() req: Request, @Res() res: Response, @Query("redirect") redirectUrl: string, @Req() request: Request) {
        const code = req.query.code as string;
        //@ts-ignore
        const token = this.authUserService.googleAuth(code, request.user.id)
        res.cookie("jwt", token, {
        maxAge: 900000,
        httpOnly: true,
        secure: false,
        })

        res.redirect(redirectUrl)
    }
}
