import {ParkingType} from "../enums/parking-type.enum";
import {Customer} from "../entities/customer.entity";
import {Partner} from "../entities/partner.entity";

export class CreateParkingLogDto {
  parkingPlaceId: number;
  customer: Customer;
  partner: Partner;
  type: ParkingType;
  vehicle: string;
  vehiclePlate: string;
  discountValue: number;
  totalValue: number;
  entranceTime: Date;
  exitTime: Date;

  constructor(
    parkingPlaceId: number,
    customer: Customer,
    partner: Partner,
    type: ParkingType,
    vehicle: string,
    vehiclePlate: string,
    totalValue: number,
    entranceTime: Date,
    exitTime: Date
  ) {
    this.parkingPlaceId = parkingPlaceId;
    this.customer = customer;
    this.partner = partner;
    this.type = type;
    this.vehicle = vehicle;
    this.vehiclePlate = vehiclePlate;
    this.discountValue = partner?.discount;
    this.totalValue = totalValue;
    this.entranceTime = entranceTime;
    this.exitTime = exitTime;
  }
}