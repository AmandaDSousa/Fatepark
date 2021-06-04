import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Put
} from '@nestjs/common';

import {ParkingPlacesService} from "../services/parking-places.service";
import {UpdateParkingPlaceDto} from "../dto/update-parking-place.dto";
import {CustomersService} from "../services/customers.service";
import {Customer} from "../entities/customer.entity";
import {PartnersService} from "../services/partners-service";
import {ParkingLogsService} from "../services/parking-logs.service";
import {CreateParkingLogDto} from "../dto/create-parking-log.dto";
import {ParkingPlace} from "../entities/parking-place.entity";

const PARKING_HOUR_VALUE = 10;

@Controller('parking-places')
export class ParkingPlacesController {
  constructor(
    private parkingPlacesService: ParkingPlacesService,
    private customersService: CustomersService,
    private partnersService: PartnersService,
    private parkingLogsService: ParkingLogsService
  ) {
  }

  @Get(":page/:perPage")
  getAll(
    @Param("page", ParseIntPipe) page: number,
    @Param("perPage", ParseIntPipe) perPage: number
  ) {
    try {
      return this.parkingPlacesService.getPaged(page, perPage);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateParkingPlaceDto
  ) {
    try {
      const {customerId, partnerId, type, isOccupied} = updateDto;

      const parkingPlace = await this.parkingPlacesService.getById(id);

      if (!parkingPlace)
        return new BadRequestException("Não existe vaga com esse id");

      const updatingParkingPlace: ParkingPlace = {...parkingPlace, type, isOccupied, entranceTime: new Date()};

      const customer: Customer = customerId ? await this.customersService.getById(customerId) : null;

      if (customerId && customer === null)
        return new BadRequestException("Não existe cliente com esse id");

      const partner = partnerId ? await this.partnersService.getById(partnerId) : null;

      if (partnerId && partner === null)
        return new BadRequestException("Não existe convênio com esse id");

      await this.parkingPlacesService.update(updatingParkingPlace, customer, partner);

      if (parkingPlace.isOccupied && !isOccupied) {
        const exitTime = new Date();
        const usedHours = Math.ceil(Math.abs(exitTime.getTime() - parkingPlace.entranceTime.getTime()) / 1000 / 3600);
        const totalValue = (usedHours * PARKING_HOUR_VALUE) - partner.discount;
        const createParkingLogDto = new CreateParkingLogDto(type, partner.discount, totalValue, parkingPlace.entranceTime, exitTime);

        await this.parkingLogsService.create(createParkingLogDto, customer, partner);
      }

      return "Vaga atualizada com sucesso";
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
