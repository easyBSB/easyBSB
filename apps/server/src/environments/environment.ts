export const environment = {
  production: false,
  jwt: {
    secret: 'secretPwd',
  },
  db: {
    file: 'apps/server/src/typeorm/easy-bsb-dev.sqlite',
    migrations: [
      'apps/server/src/**/migrations/*.js'
    ]
  },
  client: {
    path: ''
  }
};
