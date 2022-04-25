import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EasyBsbConnection } from './connection.entity';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';

@Module({
  imports: [TypeOrmModule.forFeature([EasyBsbConnection])],
  exports: [TypeOrmModule],
  controllers: [ConnectionsController],
  providers: [
    ConnectionsService
  ],
})
export class ConnectionsModule {}