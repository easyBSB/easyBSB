import { Module } from "@nestjs/common";
import { NetworkModule } from "@lib/network";
import { ConnectionBootstrap, ConnectionMonitor } from "./utils";

@Module({
  imports: [NetworkModule],
  providers: [ConnectionBootstrap, ConnectionMonitor],
})
export class ConnectionModule {}