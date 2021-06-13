import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, FindManyOptions, Repository} from "typeorm";

import {ParkingPlace} from "../entities/parking-place.entity";
import {ParkingType} from "../enums/parking-type.enum";
import {Partner} from "../entities/partner.entity";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {Customer} from "../entities/customer.entity";

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

  async getOccupiedRelation() {
    const occupiedCount = await this.parkingPlacesRepository.count({ where: { isOccupied: true } })
    const totalCount = await this.parkingPlacesRepository.count()

    return { occupiedCount, totalCount }
  }

  getById(id: number): Promise<ParkingPlace> {
    return this.parkingPlacesRepository.findOne({ where: { id }, relations: ['customer'] });
  }

  getByCustomer(customer: Customer): Promise<ParkingPlace> {
    return this.parkingPlacesRepository.findOne({ where: { customer } });
  }

  async occupyAvulso(id: number, vehicle: string, vehiclePlate: string, partner?: Partner): Promise<void> {
    const updatingParkingPlace: QueryDeepPartialEntity<ParkingPlace> = {
      type: ParkingType.Avulso,
      customer: null,
      partner,
      vehicle,
      vehiclePlate,
      isOccupied: true,
      entranceTime: new Date()
    }

    await this.parkingPlacesRepository.update(id, updatingParkingPlace);
    return;
  }

  async occupyAssinante(id: number, customer: Customer): Promise<void> {
    const updatingParkingPlace: QueryDeepPartialEntity<ParkingPlace> = {
      type: ParkingType.Assinante,
      customer,
      partner: null,
      vehicle: customer.vehicle,
      vehiclePlate: customer.vehiclePlate,
      isOccupied: true,
      entranceTime: new Date()
    }

    await this.parkingPlacesRepository.update(id, updatingParkingPlace);
    return;
  }

  async getOut(id: number) {
    const updatingParkingPlace: QueryDeepPartialEntity<ParkingPlace> = {
      type: null,
      customer: null,
      partner: null,
      vehicle: null,
      vehiclePlate: null,
      isOccupied: false,
      entranceTime: null
    }

    await this.parkingPlacesRepository.update(id, updatingParkingPlace);
    return;
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