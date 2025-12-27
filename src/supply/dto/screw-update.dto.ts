import { PartialType } from "@nestjs/mapped-types";
import { ScrewDTO } from "./screw.dto.js"

export class ScrewUpdateDTO extends PartialType(ScrewDTO) {}