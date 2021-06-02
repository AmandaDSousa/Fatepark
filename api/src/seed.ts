import {NestFactory} from "@nestjs/core";

import {SeederModule} from "./seeder.module";
import {SeederService} from "./services/seeder.service";

async function bootstrap() {
  let appContext = null;

  try {
    console.log("Seeding started");

    appContext = await NestFactory.createApplicationContext(SeederModule)
    const seeder = appContext.get(SeederService);

    await seeder.seedParkingPlaces();

    console.log("Seeding completed!");
  } catch (e) {
    console.error("Seeding failed");
    throw e;
  } finally {
    if (appContext)
      appContext.close()
  }
}

bootstrap();