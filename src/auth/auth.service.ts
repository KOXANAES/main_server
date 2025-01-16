import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto)
		return this.generateToken(user)
	}

	async registration(userDto: CreateUserDto) {
		const canditate = await this.userService.getUserByEmail(userDto.email)
		if(canditate) throw new HttpException(`Пользователь ${userDto.email} уже существует!`, HttpStatus.BAD_REQUEST)
		const hashPassword = await bcrypt.hash(userDto.password, 5)
		const user = await this.userService.createUser({...userDto, password: hashPassword, role: Role.USER})
		return this.generateToken(user)
	}

	private async generateToken(user) { 
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
}