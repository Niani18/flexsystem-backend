import { PartialType } from "@nestjs/mapped-types";
import { CasingDTO } from "./casing.dto.js"

export class CasingUpdateDTO extends PartialType(CasingDTO) {}