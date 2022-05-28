import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as APP_ENVIRONMENT from "../environments/environment";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => APP_ENVIRONMENT.environment],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
