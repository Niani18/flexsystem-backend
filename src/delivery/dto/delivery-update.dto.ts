import { IsArray, IsDate, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { DeliveryState } from "../interface/delivery.entity.js";
import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { DeliveryDTO } from "./delivery.dto.js";



export class DeliveryUpdateDTO extends PartialType(DeliveryDTO){

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    dateEnd?: Date;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(0, { each: true })
    orders?: number[];

    @IsOptional()
    @IsInt()
    @Min(0)
    dealer?: number;

}