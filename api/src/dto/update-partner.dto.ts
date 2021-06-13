import {IsNotEmpty} from "class-validator";

export class UpdatePartnerDto {
  @IsNotEmpty({ message: "Nome é obrigatório" })
  name: string;

  @IsNotEmpty({ message: "Desconto é obrigatório" })
  discount: number;
}

