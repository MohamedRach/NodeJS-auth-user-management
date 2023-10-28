import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import * as argon from 'argon2';
import { NewUser } from 'src/drizzle/schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}
    validateApiKey(apiKey: string) {
        const apiKeys: string[] = ["api-key-1", "api-key-2"]
        return apiKeys.find((key) => apiKey == key);
    }

    async signup(user: NewUser) { 
        console.log(user.password)
        // @ts-ignore
        const hash = await argon.hash(user.password);
        try {
            const userADD = await this.userService.AddUser({...user, password: hash})
                //return jwt token
            // @ts-ignore
            return this.signToken(userADD.insertId, user.email)
            } catch (error){
                throw new Error(error)
            }   
    }
    async login(email: string, password: string) {
        const user = await this.userService.findOne(email);
        if(!user) throw new ForbiddenException("Email Not Found")
        //compare password
        const pwMatches = await argon.verify(user[0].password, password)
        if(!pwMatches) throw new ForbiddenException("Incorrect Password")
        
        //return jwt token
        return this.signToken(user[0].id, user[0].email)
        
    }
    async signToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email
        }
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
            secret: process.env.JWT_SECRET
        })
        return {
            access_token: token
        }
        
    }
}
