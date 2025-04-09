import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';

interface userResponse {
	id: string,
	username: string, 
	email: string, 
	isActivated: boolean,
	role: string,
	avatar: string,
}

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly emailService: EmailService,
		private readonly prisma: PrismaService,
	) {}

	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto)
		const tokens = await this.generateTokens(user)
		await this.saveToken(user.id, tokens.refreshToken)
		const userResponse = await this.createUserResponse(user)	
		return {userResponse, tokens}
	}

	async registration(userDto: CreateUserDto) {
		const canditate = await this.userService.getUserByEmail(userDto.email)
		if(canditate) throw new HttpException(`Пользователь ${userDto.email} уже существует!`, HttpStatus.BAD_REQUEST)
		const hashPassword = await bcrypt.hash(userDto.password, 5)
		const activationLink = randomUUID()
		const user = await this.userService.createUser({...userDto, password: hashPassword, role: Role.USER, activationLink})
		try { this.emailService.sendEmail(userDto.email, `${process.env.API_URL}/users/activate/${activationLink}`)
		} catch(e) {console.log(e)}
		const userResponse = await this.createUserResponse(user)
		const tokens = await this.generateTokens(userResponse)
		await this.saveToken(userResponse.id, tokens.refreshToken)
		return {userResponse, tokens}
	}

	async logout(refreshToken: string) { 
		try { 
			const token = await this.prisma.refreshToken.delete({where: {refreshToken}})
			return token
		} catch(e) { 
			return e
		}
	}

	async refresh(refreshToken: string) { 
		try { 
			if(!refreshToken) throw new UnauthorizedException()
			const userData = await this.validateRefreshToken(refreshToken)
			const tokenFromDb = await this.findToken(refreshToken)
			if(!userData && !tokenFromDb) throw new UnauthorizedException()
			const user = await this.prisma.user.findUnique({where:{id:userData.id}})
			const userResponse = await this.createUserResponse(user)
			const tokens = await this.generateTokens(userResponse)
			await this.saveToken(userResponse.id, tokens.refreshToken)
			return {userResponse, tokens}
		} catch(e) { 
			return e
		}
	}

	private async generateTokens(userResponse: any) { 
		const payload = {email: userResponse.email, id: userResponse.id, role: userResponse.role}
		const accessToken = this.jwtService.sign(payload, {
			secret: process.env.ACCESS_PRIVATE_KEY, 
			expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
		}) 
		const refreshToken = this.jwtService.sign(payload, {
			secret: process.env.REFRESH_PRIVATE_KEY,
			expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
		});
		return {accessToken, refreshToken}
	}

	private async saveToken(userId: string, refreshToken: string) { 
		const tokenData = await this.prisma.refreshToken.findUnique({where:{userId:userId}})
		if(tokenData) {
			tokenData.refreshToken = refreshToken
			return await this.prisma.refreshToken.update({
				where:{userId:userId}, 
				data:{refreshToken:refreshToken}
			})
		} else { 
			const token = await this.prisma.refreshToken.create({
				data: {
					refreshToken: refreshToken,
					userId: userId
				}
			});
			return token
		}
		
	}

	private async validateUser(userDto: CreateUserDto) { 
		const user = await this.userService.getUserByEmail(userDto.email)
		if(!user) throw new NotFoundException(`Пользователь не найден!`)
		const passwordEq = await bcrypt.compare(userDto.password, user.password)
		if(!passwordEq) throw new UnauthorizedException('Неверный пароль!')
		if(user && passwordEq) return user
	}

	async validateAccessToken(token:string) {
		try { 
			const userData = await this.jwtService.verify(token, { secret: process.env.ACCESS_PRIVATE_KEY });
			return userData
		} catch(e) { 
			console.log(e)
			return null
		}
	}

	async validateRefreshToken(token:string) {
		try { 
			const userData = await this.jwtService.verify(token, { secret: process.env.REFRESH_PRIVATE_KEY });
			return userData
		} catch(e) { 
			console.log(e)
			return null
		}
	}

	async findToken(refreshToken) { 
		const tokenData = await this.prisma.refreshToken.findUnique({where:{refreshToken}})
		return tokenData
	}

	private async createUserResponse(user: userResponse) { 
		const userResponseInfo = {
			id: user.id,
			username: user.username,
			email: user.email,
			isActivated: user.isActivated,
			role: user.role,
			avatar: user.avatar
		};
		return userResponseInfo
	}
}