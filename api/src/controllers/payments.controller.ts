import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import {PaymentsService} from "../services/payments.service";
import {CreatePaymentDto} from "../dto/create-payment.dto";
import {Customer} from "../entities/customer.entity";
import {CustomersService} from "../services/customers.service";

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private customersService: CustomersService
  ) {
  }

  @Get(":page/:perPage")
  getAll(
    @Param("page", ParseIntPipe) page: number,
    @Param("perPage", ParseIntPipe) perPage: number
  ) {
    try {
      return this.paymentsService.getPaged(page, perPage);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  @Post()
  async create(@Body() createDto: CreatePaymentDto) {
    const {customerId, start, end} = createDto;

    if (Date.parse(start) >= Date.parse(end))
      throw new BadRequestException("A data de fim deve ser depois da data de início");

    const alreadyExistsBetweenDates = await this.paymentsService.getBetweenDates(createDto.start, createDto.end) > 0;

    if (alreadyExistsBetweenDates)
      throw new BadRequestException("Já existe pagamento registrado entre essas datas");

    const customer: Customer = await this.customersService.getById(customerId);

    if (!customer)
      throw new BadRequestException("Não existe cliente informado");

    return this.paymentsService.create(createDto.start, createDto.end, customer);
  }
}
