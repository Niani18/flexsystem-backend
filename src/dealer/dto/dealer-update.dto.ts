import { PartialType } from "@nestjs/mapped-types";
import { DealerCreateDTO } from "./dealer.dto.js";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { DealerState } from "../interface/dealer.entity.js";

export class DealerDTOUpdate extends PartialType(DealerCreateDTO){

  @IsOptional()
  @IsEnum(DealerState)
  state?: DealerState;

}