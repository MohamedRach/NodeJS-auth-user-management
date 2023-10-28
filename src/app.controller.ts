import { Controller, Get, Post, Body, Res} from '@nestjs/common';
import {Response} from 'express'
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

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/login')
  login(@Body() user: login) {
    return this.authService.login(user.email, user.password)
  }

  @Post('/signUp')
  signUp(@Body() user: NewUser, @Res({passthrough: true}) response: Response) {
    const jwt = this.authService.signup(user)
    response.cookie('jwt', jwt, {httpOnly: true, domain: "localhost",});
    return jwt
  }
}
