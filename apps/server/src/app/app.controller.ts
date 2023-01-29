import { Controller, Get, Head } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { AppService } from "./app.service";
import { BypassAuthorization } from "./libs/auth";

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

  @ApiOperation({
    summary: "health",
    description: "just a ping to see we get an answer from server",
  })
  @ApiResponse({ status: 200, description: "authorized" })
  @BypassAuthorization()
  @Head("health")
  health() {
    return { status: 200 };
  }
}
