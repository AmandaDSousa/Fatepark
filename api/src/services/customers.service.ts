import {Injectable} from '@nestjs/common';
import {FindManyOptions, Like, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {Customer} from "../entities/customer.entity";
import {CreateCustomerDto} from "../dto/create-customer.dto";
import {UpdateCustomerDto} from "../dto/update-customer.dto";
import {Payment} from "../entities/payment.entity";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>
  ) {
  }

  getPaged(page: number, perPage: number) {
    const options: FindManyOptions = {
      take: perPage,
      skip: page === 1 ? 0 : perPage * (page - 1),
      order: {
        createdAt: "ASC"
      },
      where: {
        isActive: true
      }
    };

    return this.customersRepository.findAndCount(options);
  }

  async getAll(paid?: boolean, cpf?: string): Promise<{ name: string, cpf: string }[]> {
    const selectColumns: (keyof Customer)[] = ["id", "name", "cpf"];

    if (paid) {
      return this.customersRepository
        .createQueryBuilder("customer")
        .select(selectColumns)
        .innerJoin(Payment, "payment", "payment.customerId=customer.id")
        .where("\"isActive\" = true")
        .andWhere("start <= CURRENT_DATE")
        .andWhere("\"end\" >= CURRENT_DATE")
        .printSql()
        .getRawMany();
    }

    if (cpf) {
      return this.customersRepository
        .find({
          select: selectColumns,
          where: { isActive: true, cpf: Like(`${cpf}%`) }
        });
    }

    return this.customersRepository.find({ select: selectColumns, where: { isActive: true } });
  }

  getById(id: number): Promise<Customer> {
    return this.customersRepository.findOne({where: {id}});
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<number> {
    const result = await this.customersRepository.insert(createCustomerDto);
    const [{id}] = result.identifiers;

    return id;
  }

  async update(id: number, updateUserDto: UpdateCustomerDto): Promise<void> {
    await this.customersRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<void> {
    await this.customersRepository.update(id, {isActive: false});
  }
}
