import { Module } from '@nestjs/common'

import { AppConfigModule } from './app-config.module';
import { AppTypeormModule } from './app-typeorm.module'
import { AuthModule } from '@app/auth/auth.module'
import { EventsModule } from './events/events.module';

import { ConnectionsModule } from '@connections/connections.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    AppConfigModule,
    AppTypeormModule,
    AuthModule,
    ConnectionsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
