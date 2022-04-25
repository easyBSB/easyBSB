export const config = {
      type: "sqljs",
      // currently required otherwise no metada are found
      // use a glob pattern will not work maybe we have to run tsnode
      entities: [__dirname + "/**/*.{entity.{.ts,js}"],
      migrationsRun: true,
      migrationsTableName: "migrations",
      migrations: [__dirname + "/**/migrations/**/*{.ts,.js}"],
      autoSave: true,
      logging: true,
      // currently required to create tables
      // but table is not overidden for some reasons
      synchronize: false,
      location: "easy-bsb-dev.sqlite"
};
