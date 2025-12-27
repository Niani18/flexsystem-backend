import { PartialType } from "@nestjs/mapped-types";
import { TubeDTO } from "./tube.dto.js"

export class TubeUpdateDTO extends PartialType(TubeDTO) { }