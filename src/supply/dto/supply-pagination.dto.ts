import { ArrayMaxSize, IsArray, IsDecimal, IsEnum, IsInt, IsOptional, Matches } from "class-validator";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";
import { SupplyType } from "../interface/supply.entity.js";



export class SupplyPaginationDTO extends PaginationQueryDTO {
    @IsOptional()
    @IsEnum(SupplyType)
    supplyType?: SupplyType;

    
    @IsOptional()
    @IsDecimal({ decimal_digits: "2" })
    minPrice: string;

    @IsOptional()
    @IsDecimal({ decimal_digits: "2" })
    maxPrice: string;


    @IsOptional()
    @IsInt()
    minStock: number;

    @IsOptional()
    @IsInt()
    maxStock: number;

}