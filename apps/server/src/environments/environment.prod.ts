export const environment = {
  production: true,
  jwt: {
    // fix this
    secret: 'secretPwd',
  },
  db: {
    file: './easy-bsb-dev.sqlite',
    migrations: [
      './migrations/*.js'
    ]
  }
};
