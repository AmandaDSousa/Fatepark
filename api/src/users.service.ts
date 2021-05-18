import {Injectable} from '@nestjs/common';
import {FindManyOptions, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {User} from "./user.entity";
import {CreateUserDto} from "./create-user.dto";
import {UpdateUserDto} from "./update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
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

    return this.usersRepository.findAndCount(options);
  }

  getById (id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { email } });
    return count > 0;
  }

  async create(createUserDto: CreateUserDto): Promise<number> {
    const result = await this.usersRepository.insert(createUserDto);
    const [{ id }] = result.identifiers;

    return id;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.update(id, { isActive: false });
  }
}
