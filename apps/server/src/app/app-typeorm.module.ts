import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ENTITIES as CONNECTION_ENTITIES } from '@connections/entities'
import { ENTITIES as USER_ENTITIES } from '@users/entities'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqljs",
      entities: [
        ...CONNECTION_ENTITIES,
        ...USER_ENTITIES
      ],
      migrationsRun: true,
      migrationsTableName: "migrations",
      migrations: ["apps/server/src/**/migrations/*.js"],
      autoSave: true,
      logging: true,
      synchronize: false,
      location: "apps/server/src/typeorm/easy-bsb-dev.sqlite",
    })
  ],
  exports: [TypeOrmModule]
})
export class AppTypeormModule {}
