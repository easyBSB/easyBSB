import { join } from "path";

const clientPath = join(__dirname, "client");
const migrationsPath = join(__dirname, "./migrations/*.js");

export const environment = {
  production: true,
  envFilePath: ".env",
  jwt: {
    secret: "secretPwd",
  },
  database: {
    file: 'easy-bsb.sqlite',
    migrations: [migrationsPath],
    logging: false,
  },
  client: {
    path: clientPath,
  },
};
