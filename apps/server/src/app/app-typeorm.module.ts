import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ENTITIES as CONNECTION_ENTITIES } from "@connections/entities";
import { User } from "@app/users/entities/user";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { homedir } from "os";
import { dirname, join } from "path";
import { mkdirSync } from "fs";

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

        database = process.env.EASYBSB_DATABASE_FILE ?? database;
        mkdirSync(dirname(database), { recursive: true })

        return {
          type: "sqljs",
          entities: [...CONNECTION_ENTITIES, User],
          migrationsRun: true,
          migrationsTableName: "migrations",
          migrations: [...config.get("database.migrations")],
          autoSave: true,
          logging: true,
          synchronize: false,
          location: database
      }},
    }),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeormModule {}
