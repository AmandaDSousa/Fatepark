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
import {Partner} from "../entities/partner.entity";
import {PartnersService} from "../services/partners-service";

@Controller('parking-places')
export class ParkingPlacesController {
  constructor(
    private parkingPlacesService: ParkingPlacesService,
    private customersService: CustomersService,
    private partnersService: PartnersService
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
      const {customerId, partnerId} = updateDto;

      const parkingPlace = await this.parkingPlacesService.getById(id);

      if (!parkingPlace)
        return new BadRequestException("Não existe vaga com esse id");

      const customer: Customer = customerId ? await this.customersService.getById(customerId) : null;

      if (customerId && customer === null)
        return new BadRequestException("Não existe cliente com esse id");

      const partner = partnerId ? await this.partnersService.getById(partnerId) : null;

      if (partnerId && partner === null)
        return new BadRequestException("Não existe convênio com esse id");

      await this.parkingPlacesService.update(parkingPlace, customer, partner);

      return "Vaga atualizada com sucesso";
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
