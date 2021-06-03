import {IsDate, IsOptional} from "class-validator";

import {ParkingType} from "../enums/parking-type.enum";

export class UpdateParkingPlaceDto {
  customerId: number;

  partnerId: number;

  type?: ParkingType;

  @IsOptional()
  @IsDate({ message: "Data inválida" })
  entranceTime: Date;

  isOccupied: boolean;
}

