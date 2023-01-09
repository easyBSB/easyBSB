import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Bus } from "./model/bus.entity";
import { Device } from "./model/device.entity";
import { BsbStorage } from "./utils/bsb-store";
import { BusService } from "./utils/bus.service";
import { BusValidation } from "./utils/bus.validators";
import { DeviceService } from "./utils/device.service";
import { DeviceValidator } from "./utils/device.validator";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Bus, Device ]),
  ],
  providers: [
    BusService,
    BusValidation,
    DeviceService,
    DeviceValidator,
    BsbStorage
  ],
  exports: [
    TypeOrmModule,
    BusService,
    DeviceService
  ],
})
export class NetworkModule {}
