import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import {AuthGuard} from '@nestjs/passport'
import { Reflector } from "@nestjs/core";
import { UnauthorizedException } from "@nestjs/common/exceptions";
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}