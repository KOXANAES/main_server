import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/auth/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate { 
    constructor(
        private jwtService:JwtService,
        private readonly reflector: Reflector
    ) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try { 

            const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [ 
                context.getHandler(), 
                context.getClass()
            ])
            if(!requiredRoles) return true

            const authHeader = req.headers.authorization 
            const tokenType = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if(tokenType !== 'Bearer' || !token) throw new UnauthorizedException('Пользователь не авторизован!')
            const user = this.jwtService.verify(token, { secret: process.env.ACCESS_PRIVATE_KEY })
            req.user = user 
            console.log(user)
            return requiredRoles.includes(user.role);
        } catch(e) { 
            console.log(e)
            throw new UnauthorizedException('Не соответствует уровень доступа!')
        }
    }
}