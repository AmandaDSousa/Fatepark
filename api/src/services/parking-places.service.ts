import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, Repository} from "typeorm";

import {ParkingPlace} from "../entities/parking-place.entity";

@Injectable()
export class ParkingPlacesService {
  constructor(
    @InjectRepository(ParkingPlace)
    private parkingPlacesRepository: Repository<ParkingPlace>,
    private connection: Connection
  ) {
  }

  async createMany(parkingPlaces: ParkingPlace[]): Promise<void> {
    await this.connection
      .createQueryBuilder()
      .insert()
      .into(ParkingPlace)
      .values(parkingPlaces)
      .execute();
  }
}