export const environment = {
  production: false,
  envFilePath: ".env.e2e",
  jwt: {
    secret: "secretPwd",
  },
  database: {
    migrations: ["apps/server/src/**/migrations/*.js"],
    file: "dist/tmp/easy-bsb-dev.e2e.sqlite",
  },
};
