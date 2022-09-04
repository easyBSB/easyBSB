import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
          database = join(homedir(), ".easybsb/easy-bsb.sqlite");
        }

        database = process.env.EASYBSB_DATABASE_FILE ?? database;
        mkdirSync(dirname(database), { recursive: true })

        return {
          type: "sqljs",
          migrationsRun: true,
          migrationsTableName: "migrations",
          migrations: [...config.get("database.migrations")],
          autoSave: true,
          logging: config.get('database.logging'),
          synchronize: false,
          location: database,
          autoLoadEntities: true
      }},
    }),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeormModule {}
