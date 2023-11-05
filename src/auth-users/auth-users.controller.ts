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
    async signUp(@Body() user: NewUserOfUser, @Res({passthrough: true}) response: Response, @Query("redirect") redirectUrl: string, @Req() request: Request) {
        //@ts-ignore
        const jwt = await this.authUserService.signup(user, request.user.id)
        response.cookie('jwt', jwt, {httpOnly: true, domain: "localhost",});
        response.redirect(redirectUrl)
    }
    @UseGuards(ApiKeyAuthGuard)
    @Post('/login?')
    async login(@Body() user: login,@Query("redirect") redirectUrl: string, @Res() response: Response, @Req() request: Request) {
        //const id = request;
        //@ts-ignore
        const jwt = await this.authUserService.login(user.email, user.password, request.user.id)
        console.log(jwt)
        if (jwt ){
            response.cookie('jwt', jwt, {httpOnly: true, domain: "localhost",});
            response.redirect(redirectUrl)
        }
        
    }
    @UseGuards(ApiKeyAuthGuard)
    @Get("/google/signup")
    googleSignUp(@Res() res: Response, @Query("redirect") redirect: string, @Req() req: Request) {
        const url = this.authUserService.getGoogleAuthURL();
        //@ts-ignore
        res.cookie("redirect", {redirect , id: req.user.id})
        return res.redirect(url)
    }
    
    @Get("/api/sessions/oauth/google")
    async redirect(@Req() req: Request, @Res() res: Response) {
        const code = req.query.code as string;
        //@ts-ignore
        const jwt = await this.authUserService.googleAuth(code, req.cookies.redirect.id)
        res.cookie('jwt', jwt, {httpOnly: true});
        res.redirect(req.cookies.redirect.redirect)

        
    }
}
