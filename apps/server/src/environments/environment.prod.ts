import { join } from 'path';

const clientPath = join(__dirname, 'client')
const migrationsPath = join(__dirname, './migrations/*.js')
const databaseFile = join(__dirname, './easy-bsb.sqlite')

export const environment = {
  production: true,
  jwt: {
    // fix this
    secret: 'secretPwd',
  },
  db: {
    file: databaseFile,
    migrations: [ migrationsPath ]
  },
  client: {
    path: clientPath
  }
};
