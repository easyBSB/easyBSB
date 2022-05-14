import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ENTITIES as CONNECTION_ENTITIES } from '@connections/entities'
import { User } from '@app/users'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqljs",
      entities: [
        ...CONNECTION_ENTITIES,
        User
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
