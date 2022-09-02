import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles";
import { DeviceController } from "./device.controller";
import { Device } from "./device.entity";
import { DeviceService } from "./device.service";

@Module({
  imports: [TypeOrmModule.forFeature([Device]), RolesModule],
  controllers: [DeviceController],
  providers: [
    DeviceService,
  ],
  exports: [TypeOrmModule],
})
export class BusModule {}
