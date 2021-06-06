import {Injectable} from "@nestjs/common";

import {ParkingPlacesService} from "./parking-places.service";
import {ParkingPlace} from "../entities/parking-place.entity";

@Injectable()
export class SeederService {
  constructor(
    private readonly parkingPlacesService: ParkingPlacesService
  ) {
  }

  async seedParkingPlaces(): Promise<void> {
    const parkingPlaces = Array(50).fill(new ParkingPlace());
    await this.parkingPlacesService.createMany(parkingPlaces);
  }
}