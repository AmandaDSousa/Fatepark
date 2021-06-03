import {ParkingType} from "../enums/parking-type.enum";

export class CreateParkingLogDto {
  type: ParkingType;
  discountValue: number;
  totalValue: number;
  entranceTime: Date;
  exitTime: Date;

  constructor(type: ParkingType, discountValue: number, totalValue: number, entranceTime: Date, exitTime: Date) {
    this.type = type;
    this.discountValue = discountValue;
    this.totalValue = totalValue;
    this.entranceTime = entranceTime;
    this.exitTime = exitTime;
  }
}