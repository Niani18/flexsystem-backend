import { Transform, Type } from "class-transformer";
import { IsInt, IsNumber, IsPositive } from "class-validator";

export class SupplyHoseDTO {

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  amount!: number

  @Type(() => Number)
  @IsInt()
  supply!: number;       

}