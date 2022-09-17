import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles";
import { BusController } from "./controllers/bus.controller";
import { DeviceController } from "./controllers/device.controller";
import { Bus } from "./model/bus.entity";
import { Device } from "./model/device.entity";
import { BusService } from "./utils/bus.service";
import { BusValidation } from "./utils/bus.validators";
import { DeviceService } from "./utils/device.service";
import { DeviceValidator } from "./utils/device.validator";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Bus, Device ]),
    RolesModule
  ],
  controllers: [
    BusController,
    DeviceController
  ],
  providers: [
    BusService,
    BusValidation,
    DeviceService,
    DeviceValidator
  ],
  exports: [TypeOrmModule],
})
export class BusModule {}
