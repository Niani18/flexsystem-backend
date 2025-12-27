import { IsNumber, IsPositive } from "class-validator";
import { SupplyDTO } from "./supply.dto.js";
import { Transform } from "class-transformer";

export class ElbowDTO extends SupplyDTO {

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  diameter!: number

}