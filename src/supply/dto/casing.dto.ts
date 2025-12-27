import { IsString } from "class-validator";
import { SupplyDTO } from "./supply.dto.js";
import { Transform } from "class-transformer";

export class CasingDTO extends SupplyDTO {

  @IsString()
  @Transform(({value}) => String(value).trim())
  conditions!: string

  @IsString()
  @Transform(({value}) => String(value).trim())
  material!: string

}