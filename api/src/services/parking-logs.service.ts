import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Repository} from "typeorm";

import {ParkingLog} from "../entities/parking-log.entity";
import {Partner} from "../entities/partner.entity";
import {Customer} from "../entities/customer.entity";
import {CreateParkingLogDto} from "../dto/create-parking-log.dto";

@Injectable()
export class ParkingLogsService {
  constructor(
    @InjectRepository(ParkingLog)
    private parkingLogsRepository: Repository<ParkingLog>,
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

    return this.parkingLogsRepository.findAndCount(options);
  }

  async create(createDto: CreateParkingLogDto, customer?: Customer, partner?: Partner): Promise<void> {
    await this.parkingLogsRepository.insert({ ...createDto, customer, partner });
  }
}