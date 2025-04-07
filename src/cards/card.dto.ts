    import { Categories, Criterias, Heating, HomeType, Role, Violations } from "@prisma/client"
    import { Type } from "class-transformer";
    import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
    import { CreateResidentDto } from "./residents.dto";

    export class CreateCardDto { 

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

        @IsString()
        creatorId: string

        @IsString()
        inspectorId: string

        @IsOptional()
        @IsNumber()
        instructured?: number    

        @IsOptional()
        @IsBoolean()
        isWithSocials?: boolean
    } 