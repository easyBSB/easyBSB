/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { resolve } from "path";

import { AppModule } from "./app/app.module";

async function bootstrap() {
  dotenv.config({ path: resolve(process.cwd(), '.env') })

  const app = await NestFactory.create(AppModule);
  await ConfigModule.envVariablesLoaded;

  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.EASYBSB_PORT || 3333;

  const config = new DocumentBuilder()
    .setTitle("EasyBsb")
    .setDescription("EasyBsb API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
