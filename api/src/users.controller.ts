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
  Put
} from '@nestjs/common';

import {CreateUserDto} from "./create-user.dto";
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./update-user.dto";

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Get(":page/:perPage")
  getAll(
    @Param("page", ParseIntPipe) page: number,
    @Param("perPage", ParseIntPipe) perPage: number
  ) {
    try {
      return this.usersService.getPaged(page, perPage);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Post()
  async create(@Body() createDto: CreateUserDto) {
    try {
      if (await this.usersService.emailExists(createDto.email))
        return new BadRequestException("Já existe usuário com este email");

      return this.usersService.create(createDto);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto
  ) {
    try {
      const user = await this.usersService.getById(id);

      if (!user)
        return new BadRequestException("Não existe usuário com esse id");

      if (user.email !== updateDto.email && await this.usersService.emailExists(updateDto.email))
        return new BadRequestException("Já existe usuário com este email");

      await this.usersService.update(id, updateDto);
      return "Usuário Atualizado com sucesso"
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return this.usersService.delete(id);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
