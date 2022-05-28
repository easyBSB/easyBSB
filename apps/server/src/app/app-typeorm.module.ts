import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ENTITIES as CONNECTION_ENTITIES } from "@connections/entities";
import { User } from "@app/users/entities/user";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log(config.get("db.file"));

        return {
          type: "sqljs",
          entities: [...CONNECTION_ENTITIES, User],
          migrationsRun: true,
          migrationsTableName: "migrations",
          migrations: [...config.get("db.migrations")],
          autoSave: true,
          logging: true,
          synchronize: false,
          location: config.get("db.file"),
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeormModule {}
