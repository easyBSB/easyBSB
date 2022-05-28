export const environment = {
  production: false,
  jwt: {
    secret: "secretPwd",
  },
  db: {
    file: "apps/easybsb-server/src/typeorm/easy-bsb-dev.sqlite",
    migrations: ["apps/easybsb-server/src/**/migrations/*.js"],
  },
};
