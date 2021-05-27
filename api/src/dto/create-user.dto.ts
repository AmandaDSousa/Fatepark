import {IsEmail, IsNotEmpty} from "class-validator";

import {UserTypeEnum} from "../enums/user-type.enum";

export class CreateUserDto {
  @IsNotEmpty({ message: "Nome é obrigatório" })
  name: string;

  @IsEmail({}, { message: "E-mail inválido" })
  email: string;

  @IsNotEmpty({ message: "Senha é obrigatória" })
  password: string;

  @IsNotEmpty({ message: "Tipo é obrigatório" })
  type: UserTypeEnum;
}

