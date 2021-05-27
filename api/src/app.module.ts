import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import {User} from "./entities/user.entity";
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants/jwt.constants";
import {AuthService} from "./services/auth.service";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "admin",
      password: "admin",
      database: "fatepark_database",
      entities: [],
      autoLoadEntities: true,
      synchronize: true
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret
    })
  ],
  controllers: [AppController, UsersController],
  providers: [LocalStrategy, JwtStrategy, AuthService, AppService, UsersService],
})
export class AppModule {}
