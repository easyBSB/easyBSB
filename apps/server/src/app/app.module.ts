import { Module } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core';

import { ConnectionsModule } from '@connections/connections.module'
import { RoleGuard, RolesModule } from '@app/roles/index';
import { UsersModule } from '@app/users';
import { AuthModule, JwtAuthGuard } from '@app/auth';
import { EventsModule } from './events/events.module';

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfigModule } from './app-config.module';
import { AppTypeormModule } from './app-typeorm.module'

@Module({
  imports: [
    AppConfigModule,
    AppTypeormModule,
    AuthModule,
    RolesModule,
    UsersModule,
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
