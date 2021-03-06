import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Repository} from "typeorm";

import {ParkingLog} from "../entities/parking-log.entity";
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
        exitTime: "DESC"
      },
      relations: ["customer", "partner"]
    };

    return this.parkingLogsRepository.findAndCount(options);
  }

  async create(createDto: CreateParkingLogDto): Promise<void> {
    await this.parkingLogsRepository.insert(createDto);
    return;
  }
}