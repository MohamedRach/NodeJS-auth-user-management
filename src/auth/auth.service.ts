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
    getGoogleAuthURL() {
        console.log(process.env.GOOGLE_CLIENT_ID)
        const redirectURI = "api/sessions/oauth/google"
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

    async googleAuth(code: string) {
        const { id_token, access_token} = await this.getToken({
            code,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: `${process.env.SERVER_ROOT_URI}/api/sessions/oauth/google`
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
        const user = await this.userService.findOne(googleUser.email);
        if(!user) {
            const token = this.signup({
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                email: googleUser.email,
                password: "DefaultPassword"
            })
    
            return token
        }
        console.log("login")
        return this.signToken(user[0].id, user[0].email)
        
        /*
        res.cookie(COOKIE_NAME, token, {
            maxAge: 900000,
            httpOnly: true,
            secure: false,
        })
    
        res.redirect("/")
        */
    }
}
