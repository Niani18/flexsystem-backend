import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderState } from "../interface/order.entity.js";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";

export class OrderPaginationDTO extends PaginationQueryDTO {

  @IsOptional()
  @IsISO8601({ strict: false })
  from?: string

  @IsOptional()
  @IsISO8601({ strict: false })
  to?: string

  @IsOptional()
  @IsEnum(OrderState)
  state?: OrderState

  @IsOptional()
  @IsString()
  deliveryMethod?: string

  @IsOptional()
  @IsNumber()
  clientId?: number

  @IsOptional()
  @IsNumber()
  orderId?: number

}