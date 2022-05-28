import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: "Welcome to server 2!" };
  }

  log() {
    // must be singleton
  }
}
