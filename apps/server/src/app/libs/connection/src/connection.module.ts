import { Module } from "@nestjs/common";
import { NetworkModule } from "@lib/network";
import { ConnectionMonitor } from "./utils/connection-monitor";

@Module({
  imports: [NetworkModule],
  providers: [ ConnectionMonitor ],
  exports: [ ConnectionMonitor ]
})
export class ConnectionModule {}