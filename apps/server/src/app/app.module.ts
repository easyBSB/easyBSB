import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";

import { AuthModule, JwtAuthGuard } from "@lib/auth";
import { UsersModule } from "@lib/users";

import { EventsModule } from "./events/events.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigModule } from "./app-config.module";
import { AppTypeormModule } from "./app-typeorm.module";

// add serve static module only for production
import { environment as APP_ENVIRONMENT } from "../environments/environment";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RoleGuard, RolesModule } from "@lib/roles";
import { ConnectionModule } from "@lib/connection";
import { ConnectionBootstrap } from "./connection.bootstrap";
import { NetworkHttpModule } from "./libs/network/network-http.module";

const extraImports: DynamicModule[] = [];
if (APP_ENVIRONMENT.production) {
  extraImports.push(
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: config.get("client.path"),
        },
      ],
    })
  );
}

@Module({
  imports: [
    AppConfigModule,
    AppTypeormModule,
    ConnectionModule,
    AuthModule,
    NetworkHttpModule,
    RolesModule,
    UsersModule,
    EventsModule,
    ...extraImports,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConnectionBootstrap,
    {
      provide: APP_GUARD,
      useFactory: () => {
        return new JwtAuthGuard(new Reflector());
      },
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
