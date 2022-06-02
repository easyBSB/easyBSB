export const environment = {
  production: false,
  envFilePath: ".env.e2e",
  jwt: {
    secret: "secretPwd",
  },
  database: {
    migrations: ["apps/server/src/**/migrations/*.js"],
    file: "apps/server/src/typeorm/easy-bsb-dev.e2e.sqlite",
  },
};
