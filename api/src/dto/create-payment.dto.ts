import {IsDateString, IsNotEmpty} from "class-validator";

export class CreatePaymentDto {
  @IsNotEmpty({ message: "Cliente é obrigatório" })
  customerId: number;

  @IsNotEmpty({ message: "Data de início é obrigatório" })
  @IsDateString({ strict: false }, { message: "Data de início inválida"})
  start: string;

  @IsNotEmpty({ message: "Date de fim é obrigatório" })
  @IsDateString({ strict: false }, { message: "Data de fim inválida"})
  end: string;
}
