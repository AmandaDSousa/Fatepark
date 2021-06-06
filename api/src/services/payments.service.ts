import {Injectable} from '@nestjs/common';
import {Between, FindManyOptions, LessThan, MoreThanOrEqual, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {Payment} from "../entities/payment.entity";
import {Customer} from "../entities/customer.entity";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>
  ) {
  }

  getPaged(page: number, perPage: number) {
    const options: FindManyOptions = {
      take: perPage,
      skip: page === 1 ? 0 : perPage * (page - 1),
      order: {
        createdAt: "ASC"
      }
    };

    return this.paymentsRepository.findAndCount(options);
  }

  getBetweenDates(start: string, end: string): Promise<number> {
    return this.paymentsRepository.count({
      where: [
        {start: Between(start, end)},
        {end: Between(start, end)}
      ]
    });
  }

  async create(start: string, end: string, customer: Customer): Promise<number> {
    const creatingPayment: QueryDeepPartialEntity<Payment> = {customer, start, end};

    const result = await this.paymentsRepository.insert(creatingPayment);
    const [{id}] = result.identifiers;

    return id;
  }
}