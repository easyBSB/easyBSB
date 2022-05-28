import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AppService } from "./app.service";

@ApiBearerAuth()
@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get("log")
  getInfo() {
    return this.appService.log();
  }

  @Get("ping")
  getPing() {
    return {
      message: "pong",
    };
  }
}
