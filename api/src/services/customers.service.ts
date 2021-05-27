import {Injectable} from '@nestjs/common';
import {FindManyOptions, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {Customer} from "../entities/customer.entity";
import {CreateCustomerDto} from "../dto/create-customer.dto";
import {UpdateCustomerDto} from "../dto/updatecustomer.dto";

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

  getById (id: number): Promise<Customer> {
    return this.customersRepository.findOne({ where: { id } });
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<number> {
    const result = await this.customersRepository.insert(createCustomerDto);
    const [{ id }] = result.identifiers;

    return id;
  }

  async update(id: number, updateUserDto: UpdateCustomerDto): Promise<void> {
    await this.customersRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<void> {
    await this.customersRepository.update(id, { isActive: false });
  }
}
