import { IsOptional, IsString } from "class-validator";
import { ExecFileSyncOptionsWithBufferEncoding } from "node:child_process";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";



export class ClientPaginationDTO extends PaginationQueryDTO {

  @IsOptional()
  @IsString()
  nameAndSurname: string;

}