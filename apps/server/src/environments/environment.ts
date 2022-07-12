import { resolve } from "path";

export const environment = {
  production: false,
  envFilePath: ".env",
  jwt: {
    secret: 'secret'
  },
  database: {
    file: resolve("tmp/easybsb.sqlite"),
    migrations: ["apps/server/src/**/migrations/*.js"],
    logging: true
  },
};
