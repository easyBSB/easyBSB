import { ConnectionModule } from "@easy-bsb/server/lib/connection";
import { RolesModule } from "@easy-bsb/server/lib/roles";
import { Module } from "@nestjs/common";

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
