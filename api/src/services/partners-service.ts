import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Partner} from "../entities/partner.entity";

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnersRepository: Repository<Partner>,
  ) {
  }

  getById(id: number): Promise<Partner> {
    return this.partnersRepository.findOne({where: {id}});
  }
}