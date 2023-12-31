import { Controller, Get, Post, Body, Res, Req, Query, UseGuards} from '@nestjs/common';
import {Response, Request} from 'express'
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { NewUser } from './drizzle/schema';
import { AuthGuard } from '@nestjs/passport';
type login =  {
  email: string,
  password: string
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get('/')
  getHello(){
    //return this.appService.getHello();
    return "hello world"
  }

  @Post('/login')
  async login(@Body() user: login, @Res({passthrough: true}) response: Response, @Query("redirect") redirect: string) {
    const jwt = await this.authService.login(user.email, user.password)
    
    
    response.set("Access-Control-Allow-Credentials", "true")
    response.cookie('jwt', jwt.access_token,{
      maxAge: 900000,
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    
    
  }

  @Post('/signUp')
  async signUp(@Body() user: NewUser, @Res({passthrough: true}) response: Response, @Query("redirect") redirect: string) {
    const jwt = await this.authService.signup(user)
    response.set("Access-Control-Allow-Credentials", "true")
    response.cookie('jwt', jwt.access_token, {
      maxAge: 900000,
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    
  }

  @Get("/google/signup")
  googleSignUp(@Res() res: Response) {
    const url = this.authService.getGoogleAuthURL();
    res.redirect(url)
  }

  @Get("/api/sessions/oauth/google")
  async redirect(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    const token = await this.authService.googleAuth(code)
    
    res.set("Access-Control-Allow-Credentials", "true")
    res.cookie("jwt", token.access_token, {
      maxAge: 900000,
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    
    
  }
  @UseGuards(AuthGuard(["jwt", "api-key"]))
  @Get("/apiKey")
  async getApiKey(@Req() req: Request) {
     //@ts-ignore
    const api_key = await this.authService.getApiKey(req.user.userId)
    
    return api_key
  }
}
