import { Module } from '@nestjs/common'

import { AppConfigModule } from './app-config.module';
import { AppTypeormModule } from './app-typeorm.module'
import { AuthModule } from '@app/auth/auth.module'
import { EventsModule } from './events/events.module';

import { ConnectionsModule } from '@connections/connections.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RoleGuard, RolesModule } from './roles';
import { JwtAuthGuard } from './auth/utils/jwt-auth.guard';

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
