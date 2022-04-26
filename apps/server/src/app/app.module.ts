import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppTypeormModule } from './app.typeorm.module'
import { ConnectionsModule } from './connections/connections.module'

@Module({
  imports: [
    AppTypeormModule,
    ConnectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
