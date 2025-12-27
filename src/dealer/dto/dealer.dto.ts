import { Transform } from "class-transformer";
import { IsString, Length, Matches, ValidateNested } from "class-validator";
import { User } from "../../auth/interface/user.entity.js";

export class DealerCreateDTO {

  @IsString() @Length(8)
  @Transform(({value}) => String(value).trim())
  @Matches(/^\d{2}-\d{8}-\d/, { message: "The passed string is not formatted as cuil" })
  cuil!: string

  @IsString() 
  @Transform(({value}) => String(value).trim())
  name!: string

  @IsString() 
  @Transform(({value}) => String(value).trim())
  surname!: string

  @IsString() 
  @Transform(({value}) => String(value).trim())
  @Matches(/^\+?\d{8,15}$/, { message: 'phone: 8–15 dígitos, + opcional' })
  phone!: string

  @ValidateNested()
  user!: User

}