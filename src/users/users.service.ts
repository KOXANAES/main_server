import { Injectable } from '@nestjs/common';
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
}
