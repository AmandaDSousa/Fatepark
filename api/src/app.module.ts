import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {User} from "./user.entity";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./jwt.constants";
import {AuthService} from "./auth.service";
import {LocalStrategy} from "./local.strategy";
import {JwtStrategy} from "./jwt.strategy";

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
