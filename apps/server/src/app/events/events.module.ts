import { Module } from "@nestjs/common";
import { EasyBSBGateway } from "./easybsb.gateway";

@Module({
  providers: [EasyBSBGateway],
})
export class EventsModule {}
