import { IsNumber, IsPositive } from "class-validator";
import { SupplyDTO } from "./supply.dto.js";
import { Transform } from "class-transformer";

export class ConnectorDTO extends SupplyDTO {

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  minDiameter!: number

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => Number(value))
  maxDiameter!: number

}