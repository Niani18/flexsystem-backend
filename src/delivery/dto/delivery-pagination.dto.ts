import { IsEnum, IsISO8601, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";
import { DeliveryState } from "../interface/delivery.entity.js";
import { Transform, Type } from "class-transformer";
import { string } from "joi";

export class DeliveryPaginationDTO extends PaginationQueryDTO{

  @IsOptional()
  @IsISO8601({ strict: false }) 
  from?: string;

  @IsOptional()
  @IsISO8601({ strict: false }) 
  to?: string;

  @IsOptional()
  @IsEnum(DeliveryState)
  state?: DeliveryState;

  @IsOptional()
  @IsNumberString() 
  dealer?: string

}