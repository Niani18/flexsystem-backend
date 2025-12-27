import { IsDate, IsDecimal, IsInt, IsString } from "class-validator";



export class PaymentDTO {
    
    @IsDecimal({ decimal_digits: "2" })
    amount!: string;
    
    @IsString()
    paymentMethod!: string;

}