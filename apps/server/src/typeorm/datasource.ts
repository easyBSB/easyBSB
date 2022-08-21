import { resolve } from 'path';
import { DataSource, DataSourceOptions } from "typeorm";

// datasource for commandline script since we could not import json anymore in typeorm 3.0
// we have to provide a custom datasource
const config: DataSourceOptions = {
  type: "sqljs",
  entities: [
    __dirname + "/../**/entities/*.ts",
    __dirname + "/../**/*.entity.ts",
  ],
  migrationsRun: true,
  migrationsTableName: "migrations",
  migrations: [__dirname + "/**/migrations/*.js"],
  autoSave: true,
  logging: true,
  synchronize: false,
  location: resolve(process.cwd(), "../..", "tmp", "easybsb.sqlite"),
};

export const EasyBSBDataSource = new DataSource(config);
