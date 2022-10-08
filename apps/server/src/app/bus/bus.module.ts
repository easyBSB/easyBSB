import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles";
import { BusController } from "./controllers/bus.controller";
import { CategoriesController } from "./controllers/categories.controller";
import { DeviceController } from "./controllers/device.controller";
import { Bus } from "./model/bus.entity";
import { Device } from "./model/device.entity";
import { BsbStorage } from "./utils/bsb-store";
import { BusService } from "./utils/bus.service";
import { BusValidation } from "./utils/bus.validators";
import { ConnectionBootstrap } from "./utils/connection-boostrap.service";
import { DeviceService } from "./utils/device.service";
import { DeviceValidator } from "./utils/device.validator";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Bus, Device ]),
    RolesModule
  ],
  controllers: [
    BusController,
    CategoriesController,
    DeviceController
  ],
  providers: [
    BusService,
    BusValidation,
    DeviceService,
    DeviceValidator,
    ConnectionBootstrap,
    BsbStorage
  ],
  exports: [TypeOrmModule],
})
export class BusModule {}
