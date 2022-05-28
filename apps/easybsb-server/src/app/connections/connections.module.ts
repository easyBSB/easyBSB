import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { EasyBsbConnection } from './entities/connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EasyBsbConnection])
  ],
  exports: [TypeOrmModule],
  controllers: [ConnectionsController],
  providers: [ ConnectionsService ],
})
export class ConnectionsModule {}
