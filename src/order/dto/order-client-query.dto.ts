import { IsEnum, IsInt, IsISO8601, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { OrderState } from "../interface/order.entity.js"
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js"



export class OrderClientQueryDTO extends PaginationQueryDTO {

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
  @IsInt()
  @Min(0)
  orderId: number;

}