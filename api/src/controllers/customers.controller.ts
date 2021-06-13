import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param, ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put, Query
} from '@nestjs/common';

import {CustomersService} from "../services/customers.service";
import {CreateCustomerDto} from "../dto/create-customer.dto";
import {UpdateCustomerDto} from "../dto/update-customer.dto";

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {
  }

  @Get()
  getAll(
    @Query() params,
  ) {
    try {
      return this.customersService.getAll(!!params.paid, params.cpf);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Get(":page/:perPage")
  getAllPaged(
    @Param("page", ParseIntPipe) page: number,
    @Param("perPage", ParseIntPipe) perPage: number,
  ) {
    try {
      return this.customersService.getPaged(page, perPage);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Post()
  async create(@Body() createDto: CreateCustomerDto) {
    try {
      return this.customersService.create(createDto);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateCustomerDto
  ) {
    try {
      const customer = await this.customersService.getById(id);

      if (!customer)
        return new BadRequestException("Não existe usuário com esse id");

      await this.customersService.update(id, updateDto);

      return "Cliente atualizado com sucesso";
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return this.customersService.delete(id);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
