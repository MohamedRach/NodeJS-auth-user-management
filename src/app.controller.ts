import { Controller, Get, Post, Body, Res, Req} from '@nestjs/common';
import {Response, Request} from 'express'
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { NewUser } from './drizzle/schema';

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
  }

  @Post('/login')
  async login(@Body() user: login, @Res({passthrough: true}) response: Response) {
    const jwt = await this.authService.login(user.email, user.password)
    console.log(jwt)
    response.cookie('jwt', jwt, {httpOnly: true});
    
  }

  @Post('/signUp')
  async signUp(@Body() user: NewUser, @Res({passthrough: true}) response: Response) {
    const jwt = await this.authService.signup(user)
    response.cookie('jwt', jwt, {httpOnly: true});
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
    res.cookie("jwt", token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    })

    
  }
}
