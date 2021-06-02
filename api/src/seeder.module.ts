import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {DatabaseProviderModule} from "./database-provider.module";
import {SeederService} from "./services/seeder.service";
import {ParkingPlacesService} from "./services/parking-places.service";
import {ParkingPlace} from "./entities/parking-place.entity";
import {Customer} from "./entities/customer.entity";
import {Partner} from "./entities/partner.entity";

@Module({
  imports: [
    DatabaseProviderModule,
    TypeOrmModule.forFeature([ParkingPlace, Customer, Partner]),
  ],
  providers: [SeederService, ParkingPlacesService],
})
export class SeederModule {}