import { Module } from "@nestjs/common";
import { ConnectionFactory, ConnectionStorage } from "./utils";

@Module({
  providers: [ ConnectionStorage, ConnectionFactory ],
  exports: [ ConnectionStorage, ConnectionFactory ]
})
export class ConnectionModule {}