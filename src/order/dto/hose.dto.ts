import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { SupplyHoseDTO } from "./supplyHose.dto.js";


export class HoseDTO {

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  length!: number

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  ammount!: number

  @IsString()
  @Transform(({value}) => String(value).trim())
  description!: string

  @ValidateNested()
  @Type(() => SupplyHoseDTO)
  supplyHose!: SupplyHoseDTO[]

  @IsString()
  @IsOptional()
  @Transform(({value}) => String(value).trim())
  correction?: string;

} 