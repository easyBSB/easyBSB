import { Module } from '@nestjs/common';

import { ConnectionsController } from './connections.controller';

@Module({
  imports: [],
  controllers: [ConnectionsController],
  providers: [],
})
export class ConnectionsModule {}
