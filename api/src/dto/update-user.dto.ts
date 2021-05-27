import {IsEmail, IsNotEmpty} from "class-validator";

import {UserTypeEnum} from "../enums/user-type.enum";

export class UpdateUserDto {
  @IsNotEmpty({ message: "Nome é obrigatório" })
  name: string;

  @IsEmail({}, { message: "E-mail inválido" })
  email: string;

  @IsNotEmpty({ message: "Tipo é obrigatório" })
  type: UserTypeEnum;
}
