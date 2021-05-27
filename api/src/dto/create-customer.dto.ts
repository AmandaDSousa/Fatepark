import {IsNotEmpty} from "class-validator";

import {IsCpf} from "../decorators/cpf-validation.decorator";

export class CreateCustomerDto {
  @IsNotEmpty({ message: "Nome é obrigatório" })
  name: string;

  @IsNotEmpty({ message: "CPF é obrigatório" })
  @IsCpf({ message: "CPF inválido" })
  cpf: string;

  @IsNotEmpty({ message: "Veículo é obrigatório" })
  vehicle: string;

  @IsNotEmpty({ message: "Placa é obrigatória" })
  vehiclePlate: string;
}

