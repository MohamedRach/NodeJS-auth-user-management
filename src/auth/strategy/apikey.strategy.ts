import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
    constructor(private authService: AuthService) {
        super({header: "api-key", prefix: ''}, true, async (apiKey, done) => {
            const id = this.authService.validateApiKey(apiKey)
            if (id) {
                done(null, id)
            }
            done(new UnauthorizedException(), null)
        })
    }
}