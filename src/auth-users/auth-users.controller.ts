import { Controller, Post, Res, Body, Get, Req, UseGuards, Query, Param } from '@nestjs/common';
import {Response, Request} from 'express'
import { AuthUsersService } from './auth-users.service';
import { NewUserOfUser, User } from 'src/drizzle/schema';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';
type login = {
    username: string,
    password: string
}

@Controller('auth-users')
export class AuthUsersController {
    constructor(private authUserService: AuthUsersService) {}
    @UseGuards(ApiKeyAuthGuard)
    @Post('/signup')
    async signUp(@Body() user: NewUserOfUser, @Req() request: Request) {
        //@ts-ignore
        const jwt = await this.authUserService.signup(user, request.user.id)
        return jwt
    }
    @UseGuards(ApiKeyAuthGuard)
    @Post('/login?')
    async login(@Body() user: login,@Req() request: Request) {
        //const id = request;
        //@ts-ignore
        return this.authUserService.login(user.email, user.password, request.user.id)
        
        
        
    }
    @UseGuards(ApiKeyAuthGuard)
    @Get("/google/signup")
    googleSignUp(@Res() res: Response,@Req() req: Request, @Query("redirect") redirect: string) {
        const url = this.authUserService.getGoogleAuthURL();
        //res.send(true)
        //@ts-ignore
        res.cookie("redirect", {id: req.user.id, redirect})
        res.redirect(url)
    }
    
    @Get("/api/sessions/oauth/google")
    async redirect(@Req() req: Request, @Res() res: Response) {
        const code = req.query.code as string;

        //@ts-ignore

        const jwt = await this.authUserService.googleAuth(code, req.cookies.redirect.id)
        res.cookie("jwt", jwt.access_token, {
            maxAge: 900000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.redirect(req.cookies.redirect.redirect)
        

        
    }
}
