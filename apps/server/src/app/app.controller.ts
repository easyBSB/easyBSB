import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('log')
  getInfo() {
    return this.appService.log();
  }

  @Get('ping')
  getPing() {
    return {
      message: 'pong'
    };
  }
}
