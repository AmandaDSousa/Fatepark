import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Repository} from "typeorm";

import {Partner} from "../entities/partner.entity";
import {CreatePartnerDto} from "../dto/create-partner.dto";
import {UpdatePartnerDto} from "../dto/update-partner.dto";

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnersRepository: Repository<Partner>,
  ) {
  }

  getPaged(page: number, perPage: number) {
    const options: FindManyOptions = {
      take: perPage,
      skip: page === 1 ? 0 : perPage * (page - 1),
      order: {
        id: "ASC"
      },
      where: {
        isActive: true
      }
    };

    return this.partnersRepository.findAndCount(options);
  }

  getById(id: number): Promise<Partner> {
    return this.partnersRepository.findOne({where: {id}});
  }

  async create(createCustomerDto: CreatePartnerDto): Promise<number> {
    const result = await this.partnersRepository.insert(createCustomerDto);
    const [{id}] = result.identifiers;

    return id;
  }

  async update(id: number, updateUserDto: UpdatePartnerDto): Promise<void> {
    await this.partnersRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<void> {
    await this.partnersRepository.update(id, {isActive: false});
  }
}