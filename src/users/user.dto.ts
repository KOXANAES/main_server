import { Role } from "@prisma/client"
import { IsEnum, IsString } from "class-validator"

export class CreateUserDto { 

    @IsString()
    username: string
    
    @IsString()
    email: string
    
    @IsString()
    password: string

    @IsEnum(Role)
    role?: Role
}