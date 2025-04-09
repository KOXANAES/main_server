import { Categories, Criterias, Heating, HomeType, Violations } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, IsBoolean, IsArray, IsDate, IsUUID, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { CreateResidentDto } from '../residents.dto';

export class GetCardDto {

    @IsOptional()
    @IsString()
    creatorUsername?: string;

    @IsOptional()
    @IsString()
    inspectorUsername?: string;

    @IsOptional()
    @IsBoolean()
    isChecked?: boolean;
    
    @IsOptional()
    @IsEnum(HomeType)
    homeType?: HomeType;

    @IsString()
    city: string

    @IsString()
    street: string

    @IsString()
    home: string

    @IsOptional()
    @IsString()
    apartment?: string

    @IsOptional()
    @IsNumber()
    rooms?: number

    @IsOptional()
    @IsNumber()
    apis?: number

    @IsOptional()
    @IsNumber()
    faultyapis?: number

    @IsOptional()
    @IsNumber()
    nobatteryapis?: number

    @IsOptional()
    @IsEnum(Heating)
    heating?: Heating

    @IsOptional()
    @IsNumber()
    ovens?: number
    
    @IsOptional()
    @IsNumber()
    usedovens?: number

    @IsOptional()
    @IsNumber()
    faultyovens?: number

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateResidentDto)
    residents?: CreateResidentDto[];

    @IsEnum(Categories)
    category?: Categories
    
    @IsOptional()
    @IsNumber()
    nliv?: number

    @IsOptional()
    @IsNumber()
    cnchildliv?: number

    @IsOptional()
    @IsString()
    other?: string

    @IsOptional()
    @IsEnum(Criterias)
    criterias?: Criterias[]

    @IsOptional()
    @IsEnum(Violations)
    violations?: Violations[]

    @IsOptional()
    @IsDate()
    creationDate?: Date

    @IsDate()
    inspectionDate?: Date    

    @IsDate()
    inspectionDeadline?: Date      

    @IsOptional()
    @IsNumber()
    instructured?: number    

    @IsOptional()
    @IsBoolean()
    isWithSocials?: boolean
}
