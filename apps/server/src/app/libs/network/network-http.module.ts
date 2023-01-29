import { Module } from "@nestjs/common";
import { ConnectionModule } from "../connection/public-api";
import { RolesModule } from "../roles";

import { BusController } from "./controllers/bus.controller";
import { DeviceController } from "./controllers/device.controller";
import { NetworkModule } from "./network.module";

@Module({
  imports: [
    RolesModule,
    NetworkModule,
    ConnectionModule
  ],
  controllers: [
    BusController,
    DeviceController
  ],
  exports: [
    NetworkModule
  ]
})
export class NetworkHttpModule {}
