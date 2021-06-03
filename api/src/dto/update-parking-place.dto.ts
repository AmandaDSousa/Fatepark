import {ParkingType} from "../enums/parking-type.enum";

export class UpdateParkingPlaceDto {
  customerId: number;

  partnerId: number;

  type?: ParkingType;

  isOccupied: boolean;
}

