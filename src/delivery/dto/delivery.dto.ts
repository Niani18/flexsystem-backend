import { IsDate, IsInt, Min } from "class-validator";


export class DeliveryDTO {

    @IsDate()
    dateAprox!: Date;
    
}