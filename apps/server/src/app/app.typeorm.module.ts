import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ENTITIES as CONNECTION_ENTITIES } from './connections/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqljs",
      entities: [
        ...CONNECTION_ENTITIES
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
