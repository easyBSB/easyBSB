import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ENTITIES as CONNECTION_ENTITIES } from "@connections/entities";
import { User } from "@app/users/entities/user";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { homedir } from "os";
import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        let database = config.get('database.file');

        if (config.get('production') && !process.env.EASYBSB_DATABASE_FILE) {
          database = join(homedir(), "easybsb/easy-bsb.sqlite");
        }

        return {
          type: "sqljs",
          entities: [...CONNECTION_ENTITIES, User],
          migrationsRun: true,
          migrationsTableName: "migrations",
          migrations: [...config.get("database.migrations")],
          autoSave: true,
          logging: true,
          synchronize: false,
          location: process.env.EASYBSB_DATABASE_FILE ?? database,
      }},
    }),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeormModule {}
