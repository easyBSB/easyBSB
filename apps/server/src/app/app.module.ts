import { Module } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core';

import { ConnectionsModule } from '@connections/connections.module'
import { RoleGuard, RolesModule } from '@app/roles';
import { JwtAuthGuard, AuthModule } from '@app/auth';

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfigModule } from './app-config.module';
import { AppTypeormModule } from './app-typeorm.module'
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AppConfigModule,
    AppTypeormModule,
    RolesModule,
    AuthModule,
    ConnectionsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: () => {
        return new JwtAuthGuard(new Reflector())
      },
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ],
})
export class AppModule {}
