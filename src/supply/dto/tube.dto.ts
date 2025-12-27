import { IsNumber, IsPositive } from "class-validator";
import { SupplyDTO } from "./supply.dto.js";
import { Transform } from "class-transformer";

export class TubeDTO extends SupplyDTO {

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  length!: number

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  diameter!: number

}