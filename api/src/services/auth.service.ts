import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import {UsersService} from "./users.service";
import {User} from "../entities/user.entity";
import {UserJwtPayload} from "../user-jwt.payload";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getByNameAndPassword(email);

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (user && passwordMatches) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload: UserJwtPayload = { name: user.name, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}