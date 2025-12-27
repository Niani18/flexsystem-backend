import { PartialType } from "@nestjs/mapped-types";
import { ClientCreateDTO } from "./client.dto.js";

export class ClientDtoUpdate extends PartialType(ClientCreateDTO){}