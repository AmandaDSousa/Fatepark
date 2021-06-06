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
import {Customer} from "../entities/customer.entity";
import {Partner} from "../entities/partner.entity";
import {CustomersService} from "../services/customers.service";
import {PartnersService} from "../services/partners-service";
import {ParkingLogsService} from "../services/parking-logs.service";
import {CreateParkingLogDto} from "../dto/create-parking-log.dto";

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

      const customer: Customer = customerId ? await this.customersService.getById(customerId) : null;
      const partner: Partner = partnerId ? await this.partnersService.getById(partnerId) : null;

      if (customerId && !customer)
        return new BadRequestException("Não existe cliente com esse id");

      if (partnerId && !partner)
        return new BadRequestException("Não existe convênio com esse id");

      const isGettingOut = parkingPlace.isOccupied && !isOccupied
      const vehicle = customer ? customer.vehicle : updateDto.vehicle;
      const vehiclePlate = customer ? customer.vehiclePlate : updateDto.vehiclePlate;

      if (isGettingOut) {
        await this.parkingPlacesService.update({
          ...parkingPlace,
          customer: null,
          partner: null,
          type: null,
          vehicle: null,
          vehiclePlate: null,
          isOccupied: false,
          entranceTime: null
        });

        const entranceTime = parkingPlace.entranceTime;
        const exitTime = new Date();
        const usedHours = Math.ceil(Math.abs(exitTime.getTime() - entranceTime.getTime()) / 1000 / 3600);
        const totalValue = (usedHours * PARKING_HOUR_VALUE) - partner?.discount;
        const createParkingLogDto = new CreateParkingLogDto(customer, partner, type, vehicle, vehiclePlate, totalValue, entranceTime, exitTime);

        await this.parkingLogsService.create(createParkingLogDto);
      } else {
        await this.parkingPlacesService.update({
          ...parkingPlace,
          customer,
          partner,
          type,
          vehicle,
          vehiclePlate,
          isOccupied: true,
          entranceTime: new Date()
        });
      }

      return "Vaga atualizada com sucesso";
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
