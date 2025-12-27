import { Transform } from "class-transformer";
import { IsDecimal, IsInt, IsString, Min } from "class-validator";

export abstract class SupplyDTO {

  @IsDecimal({decimal_digits: '2'})
  @Transform(({value}) => String(value).trim())
  price!: string

  @IsString()
  @Transform(({value}) => String(value).trim())
  description!: string

  @IsInt()
  @Min(0, { message: "Stock must be greater than zero" })
  @Transform(({value}) => Number(value))
  stock!: number

}