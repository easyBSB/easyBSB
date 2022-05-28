import { join } from "path";
import { homedir } from "os";

const DATABASE_FILE =
  process.env.DATABASE_FILE?.trim() ?? join(homedir(), "easy-bsb.sqlite");

const clientPath = join(__dirname, "client");
const migrationsPath = join(__dirname, "./migrations/*.js");

export const environment = {
  production: true,
  jwt: {
    // fix this
    secret: "secretPwd",
  },
  db: {
    file: DATABASE_FILE,
    migrations: [migrationsPath],
  },
  client: {
    path: clientPath,
  },
};
