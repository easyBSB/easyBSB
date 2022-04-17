import { Injectable } from '@nestjs/common';
import { BsbCore } from '@easybsb/parser';

@Injectable()
export class AppService {

  getData(): { message: string } {
    return { message: 'Welcome to server 2!' };
  }

  log() {
    const core = new BsbCore()
    core.log()
    return { message: 'logger' }
  }
}
