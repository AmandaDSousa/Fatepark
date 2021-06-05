import {ParkingType} from "../enums/parking-type.enum";

export class UpdateParkingPlaceDto {
  customerId: number;

  partnerId: number;

  vehicle: string;

  vehiclePlate: string;

  type?: ParkingType;

  isOccupied: boolean;
}

