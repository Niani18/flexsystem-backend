import { Transform } from "class-transformer";
import { IsDate, IsDecimal, IsNumber } from "class-validator";



export class SignDTO {
    
    @IsDecimal({ decimal_digits: "2" })
    @Transform(({ value }) => String(value))
    amount!: string;

}