import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import {PartnersService} from "../services/partners-service";
import {CreatePartnerDto} from "../dto/create-partner.dto";
import {UpdatePartnerDto} from "../dto/update-partner.dto";

@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {
  }

  @Get(":page/:perPage")
  getAllPaged(
    @Param("page", ParseIntPipe) page: number,
    @Param("perPage", ParseIntPipe) perPage: number,
  ) {
    try {
      return this.partnersService.getPaged(page, perPage);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Post()
  async create(@Body() createDto: CreatePartnerDto) {
    try {
      return this.partnersService.create(createDto);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdatePartnerDto
  ) {
    try {
      const customer = await this.partnersService.getById(id);

      if (!customer)
        return new BadRequestException("Não existe usuário com esse id");

      await this.partnersService.update(id, updateDto);

      return "Cliente atualizado com sucesso";
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return this.partnersService.delete(id);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
