import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectionsService } from './connections.service';


@ApiTags('connections')
@Controller('/connections')
export class ConnectionsController {

  constructor(
    private readonly connectionService: ConnectionsService
  ) {}

  @Get(':id')
  getConnections(@Param('id') id: string) {
    return ""+id;
  }

  @Post()
  createConnection() {
    this.connectionService.addEntry();
  }

  @ApiOperation({ 
    description: 'Will return in the future a websocket connection that returns the trace of the device',
   })
  @Get('trace')
  wsTrace() {
    return ""
  }

  @ApiOperation({ 
    summary: 'Same like .. just use as device 0x00' })
  @Get(':id/params/:param')
  getParam(@Param('id') id: string, @Param('param') param: string) {
    return ""+id+" "+param;
  }

  @ApiOperation({ 
    summary: 'Fetch data from the device',
    description: 'Fetch data from the device'
   })
  @Get(':id/devices/:device/params/:param')
  getDeviceParam(
    @Param('id') id: string, 
    @Param('device') device: string,
    @Param('param') param: string) {
    return ""+id+" "+param;
  }

}
