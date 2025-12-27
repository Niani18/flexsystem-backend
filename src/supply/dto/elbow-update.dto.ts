import { PartialType } from "@nestjs/mapped-types";
import { ElbowDTO } from "./elbow.dto.js"

export class ElbowUpdateDTO extends PartialType(ElbowDTO) { }