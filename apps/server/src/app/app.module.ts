import { DynamicModule, Module } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ConnectionsModule } from '@connections/connections.module'
import { RoleGuard, RolesModule } from '@app/roles/index';
import { UsersModule } from '@app/users';
import { AuthModule, JwtAuthGuard } from '@app/auth';
import { EventsModule } from './events/events.module';

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfigModule } from './app-config.module';
import { AppTypeormModule } from './app-typeorm.module'

// add serve static module only for production
import { environment as APP_ENVIRONMENT } from '../environments/environment';
import { join } from 'path';

const extraImports: DynamicModule[] = []
if (APP_ENVIRONMENT.production) {
  extraImports.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../web')
    })
  )
}

@Module({
  imports: [
    AppConfigModule,
    AppTypeormModule,
    AuthModule,
    RolesModule,
    UsersModule,
    ConnectionsModule,
    EventsModule,
    ...extraImports
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
export class AppModule {
}
