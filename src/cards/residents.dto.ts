import { IsString, IsOptional, IsDate } from 'class-validator';

export class CreateResidentDto {
  
    @IsString()
    name: string;
  
    @IsString()
    surname: string;
  
    @IsOptional()
    @IsString()
    paternity?: string;
  
    @IsDate()
    birth: Date;
  
    @IsString()
    cardId: string;
  }