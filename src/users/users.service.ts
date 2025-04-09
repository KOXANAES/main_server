import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
	constructor (private readonly prisma: PrismaService) {}

	
	findAll() { 
		return this.prisma.user.findMany()
	}

	async createUser(userDto: CreateUserDto) { 
			
		try { 
			const user = await this.prisma.user.create({
					data: userDto    
			})
			return user
		} catch(e) { 
			return e
		}
	}

	async getUserByEmail(email: string) {
		const user = await this.prisma.user.findUnique({where:{email:email}})
		return user
	}

	async activate(activationLink: string) { 
	await this.prisma.user.update({
			where: { activationLink: activationLink },
			data: { isActivated: true },
		});
	}

	async updateAvatar(userId: string, avatarUrl: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { avatar: true },
		  })
		  if (!user) throw new Error('User not found')
		  if (user.avatar) return 'avatar has been already uploaded'
			return await this.prisma.user.update({
			where: { id: userId },
			data: { avatar: avatarUrl },
			});
		
		}

}
