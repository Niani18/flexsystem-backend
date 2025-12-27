import { IsInt, IsString, ValidateNested } from "class-validator";
import { PaymentDTO } from "./payment.dto";
import { SignDTO } from "./sign.dto";
import { Type } from "class-transformer";
import { HoseDTO } from "./hose.dto.js";


export class OrderCreateDTO {
    
    @IsString()
    deliveryMethod!: string;
    
    @IsInt()
    paymentInterval!: number;

    @ValidateNested()
    @Type(() => SignDTO)
    sign!: SignDTO;

    @ValidateNested()
    @Type(() => PaymentDTO)
    payment?: PaymentDTO;

    @ValidateNested()
    @Type(() => HoseDTO)
    hose!: HoseDTO[]
}
