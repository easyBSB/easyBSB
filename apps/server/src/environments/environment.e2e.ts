export const environment = {
  production: false,
  envFilePath: ".env.e2e",
  jwt: {
    secret: "secretPwd",
  },
  db: {
    migrations: ["apps/server/src/**/migrations/*.js"],
    file: "tmp/easybsb.e2e.sqlite",
  },
};
