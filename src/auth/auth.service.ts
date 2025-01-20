import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/email/email.service';

interface userResponse {
	username: string, 
	email: string, 
	isActivated: string,
	role: string,
}

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly emailService: EmailService,
	) {}

	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto)
		const token = await this.generateToken(user)
		const userResponseInfo = {
			username: user.username,
			email: user.email,
			isActivated: user.isActivated,
			role: user.role,
		};		
		return {userResponseInfo, token}
		}

	async registration(userDto: CreateUserDto) {
		console.log(userDto)
		const canditate = await this.userService.getUserByEmail(userDto.email)
		if(canditate) throw new HttpException(`Пользователь ${userDto.email} уже существует!`, HttpStatus.BAD_REQUEST)
		const hashPassword = await bcrypt.hash(userDto.password, 5)
		const activationLink = randomUUID()
		const user = await this.userService.createUser({...userDto, password: hashPassword, role: Role.USER, activationLink})
		try { 
			console.log(userDto.email, activationLink)
			this.emailService.sendEmail(userDto.email, `${process.env.API_URL}/users/activate/${activationLink}`)
		} catch(e) { 
			console.log(e)
		}
		const token = await this.generateToken(user)
		const userResponse = await this.createUserResponse(user)
		return {userResponse, token}
	}

	async refresh(res: Response) { 
		try { 
			// const token = res.cookies
		} catch(e) { 

		}
	}

	private async generateToken(user: any) { 
		const payload = {email: user.email, id: user.id, role: user.role}
		return {token: this.jwtService.sign(payload)}
	}

	private async validateUser(userDto: CreateUserDto) { 
		const user = await this.userService.getUserByEmail(userDto.email)
		if(!user) throw new NotFoundException(`Пользователь не найден!`)
		const passwordEq = await bcrypt.compare(userDto.password, user.password)
		if(!passwordEq) throw new UnauthorizedException('Неверный пароль!')
		if(user && passwordEq) return user
	}

	async validateToken(token:string) {
		try { 
			const tokenIsValid = this.jwtService.verify(token)
		} catch(e) { 
			console.log(e)
		}

	}

	private async createUserResponse(user: userResponse) { 
		const userResponseInfo = {
			username: user.username,
			email: user.email,
			isActivated: user.isActivated,
			role: user.role,
		};
		return userResponseInfo
	}
}