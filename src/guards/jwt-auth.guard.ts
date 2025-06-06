import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate { 
	constructor(private jwtService:JwtService) {}
	
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest()
		try { 
			const authHeader = req.headers.authorization 
			const tokenType = authHeader.split(' ')[0]
			const token = authHeader.split(' ')[1]
			if(tokenType !== 'Bearer' || !token) throw new UnauthorizedException('Пользователь не авторизован!')
			const user = this.jwtService.verify(token, { secret: process.env.ACCESS_PRIVATE_KEY })
			req.user = user 
			return true
		} catch(e) { 
			console.log(e)
			throw new UnauthorizedException('Пользователь не авторизован')
		}
	}
}