import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles";
import { BusController } from "./bus.controller";
import { Bus } from "./bus.entity";
import { BusService } from "./bus.service";

@Module({
  imports: [TypeOrmModule.forFeature([Bus]), RolesModule],
  controllers: [BusController],
  providers: [BusService],
  exports: [TypeOrmModule],
})
export class BusModule {}
