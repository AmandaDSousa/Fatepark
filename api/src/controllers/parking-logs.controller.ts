import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import {ParkingLogsService} from "../services/parking-logs.service";

@Controller('parking-logs')
export class ParkingLogsController {
  constructor(
    private parkingLogsService: ParkingLogsService,
  ) {
  }

  @Get(":page/:perPage")
  getAll(
    @Param("page", ParseIntPipe) page: number,
    @Param("perPage", ParseIntPipe) perPage: number
  ) {
    try {
      return this.parkingLogsService.getPaged(page, perPage);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
