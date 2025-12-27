import { Transform, Type } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsString, IsStrongPassword, Length, Matches, ValidateNested } from "class-validator";
import { User } from "../../auth/interface/user.entity.js";


export class ClientCreateDTO {
  
  @IsString()
  @Transform(({ value }) => String(value).trim())
  cuit!: string

  @IsString() @Length(1, 60)
  @Transform(({ value }) => String(value).trim())
  name!: string;

  @IsString() @Length(1, 60)
  @Transform(({ value }) => String(value).trim())
  surname!: string;

  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email!: string;

  @IsString()
  @Transform(({ value }) => String(value).trim())
  @Matches(/^\+?\d{8,15}$/, { message: 'phone: 8–15 dígitos, + opcional' })
  phone!: string;

  @IsString()
  @Transform(({value}) => String(value).trim())
  adress!: string

  @ValidateNested()
  user!: User
  
}