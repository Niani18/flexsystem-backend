import { PartialType } from "@nestjs/mapped-types";
import { ConnectorDTO } from "./connector.dto.js"

export class ConnectorUpdateDTO extends PartialType(ConnectorDTO) {}