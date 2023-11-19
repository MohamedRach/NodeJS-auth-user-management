import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import {AuthGuard} from '@nestjs/passport'
import {Response, Request} from 'express'
import { ExecutionContext } from "@nestjs/common/interfaces";
@Injectable()
export class ApiKeyAuthGuard extends AuthGuard('api-key') {
    canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        if (request && request.query['api-key'] && !request.header('api-key')) {
            (request.headers['api-key'] as any) = request.query['api-key'];
        }
        return super.canActivate(context);
    }
}