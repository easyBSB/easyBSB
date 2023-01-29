import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { homedir } from "os";
import path = require("path");
import { environment } from "../environments/environment";

const isProd = environment.production;

function resolveEnvfilePath() {
  if (!isProd) {
    return environment.envFilePath;
  }
  return path.resolve(homedir(), "./easybsb/.env");
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolveEnvfilePath(),
      load: [() => environment],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
