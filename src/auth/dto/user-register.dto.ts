import { Type } from "class-transformer";
import { IsString, IsStrongPassword, MaxLength, ValidateNested } from "class-validator";
import { ClientCreateDTO } from "../../client/dto/client.dto.js";
import { DealerCreateDTO } from "../../dealer/dto/dealer.dto.js";


export class UserRegisterDTO {

    @IsString()
    username!: string;

    @IsString()
    @MaxLength(16)
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0
    })
    password!: string;

    @IsString()
    @MaxLength(16)
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0
    })
    passwordConfirm!: string;
}


export class ClientRegisterDTO extends UserRegisterDTO {

    @ValidateNested()
    @Type(() => ClientCreateDTO)
    client?: ClientCreateDTO
}


export class DealerRegisterDTO extends UserRegisterDTO {

    @ValidateNested()
    @Type(() => DealerCreateDTO)
    dealer?: DealerCreateDTO
    
}