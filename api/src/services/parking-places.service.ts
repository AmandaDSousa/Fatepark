import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, FindManyOptions, Repository} from "typeorm";

import {ParkingPlace} from "../entities/parking-place.entity";

@Injectable()
export class ParkingPlacesService {
  constructor(
    @InjectRepository(ParkingPlace)
    private parkingPlacesRepository: Repository<ParkingPlace>,
    private connection: Connection
  ) {
  }

  getPaged(page: number, perPage: number) {
    const options: FindManyOptions = {
      take: perPage,
      skip: page === 1 ? 0 : perPage * (page - 1),
      order: {
        id: "ASC",
        entranceTime: "DESC"
      },
      relations: ["customer", "partner"]
    };

    return this.parkingPlacesRepository.findAndCount(options);
  }

  getById (id: number): Promise<ParkingPlace> {
    return this.parkingPlacesRepository.findOne({ where: { id } });
  }

  async update(parkingPlace: ParkingPlace): Promise<void> {
    await this.parkingPlacesRepository.update(parkingPlace.id, parkingPlace);
    return;
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