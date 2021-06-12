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
import {ParkingType} from "../enums/parking-type.enum";
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
      const parkingPlace = await this.parkingPlacesService.getById(id);

      if (!parkingPlace)
        return new BadRequestException("Não existe vaga com esse id");

      const isGettingOut = parkingPlace.isOccupied && !updateDto.isOccupied;
      const isAvulso = updateDto.type === ParkingType.Avulso;

      if (isGettingOut)
        return await this.getOut(parkingPlace, updateDto);
      else if (isAvulso)
        return await this.occupyAvulso(parkingPlace, updateDto);
      else
        return await this.occupyAssinante(parkingPlace, updateDto.customerId);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async occupyAvulso(parkingPlace: ParkingPlace, updateDto: UpdateParkingPlaceDto) {
    const {partnerId, vehicle, vehiclePlate} = updateDto;

    if (!vehicle)
      return new BadRequestException("Veículo é obrigatório para vaga avulsa");

    if (!vehiclePlate)
      return new BadRequestException("Placa do veículo é obrigatório para vaga avulsa");

    if (parkingPlace.isOccupied && parkingPlace.vehiclePlate !== vehiclePlate)
      return new BadRequestException("A vaga já está ocupada por outro veículo");

    if (!partnerId) {
      await this.parkingPlacesService.occupyAvulso(parkingPlace.id, vehicle, vehiclePlate, null);
      return "Vaga atualizada com sucesso";
    }

    const partner: Partner = await this.partnersService.getById(partnerId);

    if (!partner)
      return new BadRequestException("Não existe convênio com esse id");

    await this.parkingPlacesService.occupyAvulso(parkingPlace.id, vehicle, vehiclePlate, partner);

    return "Vaga atualizada com sucesso";
  }

  async occupyAssinante(parkingPlace: ParkingPlace, customerId: number) {
    if (!customerId)
      return new BadRequestException("Cliente é obrigatório para preencher vaga de assinante");

    if (parkingPlace.isOccupied && parkingPlace.customer.id !== customerId)
      return new BadRequestException("A vaga já está ocupada por outro cliente");

    const customer: Customer = await this.customersService.getById(customerId);

    if (!customer)
      return new BadRequestException("Não existe cliente com esse id");

    await this.parkingPlacesService.occupyAssinante(parkingPlace.id, customer);

    return "Vaga atualizada com sucesso";
  }

  async getOut(parkingPlace: ParkingPlace, updateDto: UpdateParkingPlaceDto) {
    await this.parkingPlacesService.getOut(parkingPlace.id);

    const {customerId, partnerId} = updateDto;
    const { type, vehicle, vehiclePlate } = parkingPlace;

    const customer: Customer = await this.customersService.getById(customerId);
    const partner: Partner = await this.partnersService.getById(partnerId);
    const entranceTime = parkingPlace.entranceTime;
    const exitTime = new Date();
    const usedHours = Math.ceil(Math.abs(exitTime.getTime() - entranceTime.getTime()) / 1000 / 3600);
    const totalValue = (usedHours * PARKING_HOUR_VALUE) - (partner?.discount ?? 0);
    const createParkingLogDto = new CreateParkingLogDto(parkingPlace.id, customer, partner, type, vehicle, vehiclePlate, totalValue, entranceTime, exitTime);

    await this.parkingLogsService.create(createParkingLogDto);

    return "Vaga atualizada com sucesso";
  }
}
