import { DataSource, DataSourceOptions } from "typeorm";

const config: DataSourceOptions = {
  type: "sqljs",
  entities: [__dirname + "/../**/entities/*.ts"],
  migrationsRun: true,
  migrationsTableName: "migrations",
  migrations: [__dirname + "/**/migrations/*.js"],
  autoSave: true,
  logging: true,
  synchronize: false,
  location: __dirname + "/easy-bsb-dev.sqlite",
};

export const EasyBSBDataSource = new DataSource(config);
