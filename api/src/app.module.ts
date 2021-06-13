import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";

import {AppController} from './controllers/app.controller';
import {AppService} from './services/app.service';
import {User} from "./entities/user.entity";
import {UsersController} from './controllers/users.controller';
import {UsersService} from './services/users.service';
import {jwtConstants} from "./constants/jwt.constants";
import {AuthService} from "./services/auth.service";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {CustomersService} from "./services/customers.service";
import {CustomersController} from "./controllers/customers.controller";
import {Customer} from "./entities/customer.entity";
import {ParkingPlace} from "./entities/parking-place.entity";
import {Partner} from "./entities/partner.entity";
import {ParkingPlacesService} from "./services/parking-places.service";
import {DatabaseProviderModule} from "./database-provider.module";
import {ParkingPlacesController} from "./controllers/parking-places.controller";
import {PartnersService} from "./services/partners-service";
import {ParkingLog} from "./entities/parking-log.entity";
import {ParkingLogsService} from "./services/parking-logs.service";
import {ParkingLogsController} from "./controllers/parking-logs.controller";
import {Payment} from "./entities/payment.entity";
import {PaymentsController} from "./controllers/payments.controller";
import {PaymentsService} from "./services/payments.service";
import {PartnersController} from "./controllers/partners.constroller";

@Module({
  imports: [
    DatabaseProviderModule,
    TypeOrmModule.forFeature([User, Customer, ParkingPlace, Partner, ParkingLog, Payment]),
    JwtModule.register({
      secret: jwtConstants.secret
    })
  ],
  controllers: [
    AppController,
    UsersController,
    CustomersController,
    ParkingPlacesController,
    ParkingLogsController,
    PaymentsController,
    PartnersController
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService, AppService,
    UsersService, CustomersService,
    ParkingPlacesService,
    PartnersService,
    ParkingLogsService,
    PaymentsService
  ],
})
export class AppModule {
}
