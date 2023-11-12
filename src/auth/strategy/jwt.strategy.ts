import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJwt
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }
    private static extractJwt(req: Request) {
        var token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }
        
        return token;
    }

    async validate(payload: any) {
        return {userId: payload.sub, username: payload.username}
    }
}