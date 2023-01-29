import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConnectionStorage, ConnectionFactory } from "./libs/connection/public-api";
import { BusService, DeviceService } from "./libs/network/public-api";

@Injectable()
export class ConnectionBootstrap implements OnApplicationBootstrap {

  constructor(
    private readonly busService: BusService,
    private readonly deviceService: DeviceService,
    private readonly connectionStorage: ConnectionStorage,
    private readonly connectionFactory: ConnectionFactory
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    for (const bus of await this.busService.list()) {
      for (const device of await this.deviceService.list(bus.id)) {
        const connection = this.connectionFactory.create(bus, device);
        this.connectionStorage.register(connection);

        // connect directly
        await connection.connect();
      }
    }
  }
}
