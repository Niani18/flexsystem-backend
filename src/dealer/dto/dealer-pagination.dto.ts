import { IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";
import { DealerState } from "../interface/dealer.entity.js";


export class DealerPaginationDTO extends PaginationQueryDTO {

    @IsOptional()
    @IsEnum(DealerState)
    state?: DealerState;

    @IsOptional()
    @IsString()
    nameAndSurname?: string;

    @IsOptional()
    @Matches(/^\d{2}-\d{8}-\d/, { message: "The passed string is not formatted as cuil" })
    cuil?: string;
    
}