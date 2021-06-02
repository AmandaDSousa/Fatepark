import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

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
  ]
})
export class DatabaseProviderModule {}
