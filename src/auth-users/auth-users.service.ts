import { Injectable, ForbiddenException } from '@nestjs/common';
import { NewUserOfUser } from 'src/drizzle/schema';
import { JwtService } from '@nestjs/jwt/dist';
import { UsersOfUserService } from 'src/users-of-user/users-of-user.service';
import * as argon from 'argon2';
@Injectable()
export class AuthUsersService {
    constructor(private userService: UsersOfUserService, private jwtService: JwtService){}
    async signup(user: NewUserOfUser, id: number) { 
        //console.log(user.password)
        // @ts-ignore
        const hash = await argon.hash(user.password);
        try {
            const userADD = await this.userService.AddUser({...user, password: hash}, id)
                //return jwt token
            // @ts-ignore
            return this.signToken(userADD.insertId, user.email)
            } catch (error){
                throw new Error(error)
            }   
    }
    async login(email: string, password: string, id: number) {
        const user = await this.userService.findOneByEmail(email, id);
        if(user.length == 0) throw new ForbiddenException("Incorrect email")
        
        const pwMatches = await argon.verify(user[0].password, password)
        if(!pwMatches) throw  new ForbiddenException("Incorrect Password")
        
        //return jwt token
        return  this.signToken(user[0].id, user[0].email)
     
        
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
    getGoogleAuthURL() {
        const redirectURI = "auth-users/api/sessions/oauth/google"
        const rootURL = "https://accounts.google.com/o/oauth2/v2/auth"
        const options = {
            redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
            client_id: process.env.GOOGLE_CLIENT_ID,
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ].join(" "),
        }
        return `${rootURL}?${new URLSearchParams(options).toString()}`
    }
    getToken({
        code,
        clientId,
        clientSecret,
        redirectUri,
    }: {
        code: string,
        clientId: string,
        clientSecret: string,
        redirectUri: string
    }) : Promise<{
        access_token: string;
        expires_in: Number;
        refresh_token: string;
        scope: string;
        id_token: string;
    }> {
        const url =  "https://oauth2.googleapis.com/token";
        const values = {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(values).toString(),
        }).then((res) => res.json())
        .catch((error) => {
            console.log("error")
            throw new Error(error.message)
        })
    }

    async googleAuth(code: string, id: number) {
        const { id_token, access_token} = await this.getToken({
            code,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: `${process.env.SERVER_ROOT_URI}/auth-users/api/sessions/oauth/google`
        })
        const googleUser = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
        )
        .then((res) => res.json())
        .catch((error) => {
          console.error(`Failed to fetch user`);
          throw new Error(error.message);
        });
        const user = await this.userService.findOne(googleUser.email, id)
        if(user.length == 0) {
            const jwt  = await this.signup( {
                username: `${googleUser.family_name}_${googleUser.given_name}`,
                email: googleUser.email,
                password: process.env.DEFAULT_PASSWORD
            }, id)

            return jwt 
        } else {
            const jwt = await this.login(googleUser.email, process.env.DEFAULT_PASSWORD, id)
            return jwt 
        }
        
       
        
        
    }
}
