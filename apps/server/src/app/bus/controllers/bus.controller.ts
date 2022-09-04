import { Actions, CheckAbility } from "@app/roles";
import { User } from "@app/users";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from 'class-transformer';
import { Bus } from "../model/bus.entity";
import { Device } from "../model/device.entity";
import { BusService } from "../utils/bus.service";

@ApiTags("bus")
@Controller({
  path: "bus",
})
export class BusController {

  constructor(private readonly busService: BusService) {}

  @ApiOperation({
    summary: "get list of users",
    description: "get list of users",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: User })
  @Get()
  async busList(): Promise<unknown[]> {
    return this.busService.list();
  }

  @ApiOperation({
    summary: "get bus by id",
    description: "get specific bus by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: Bus })
  @Get(":id")
  async busById(): Promise<Bus> {
    return this.busService.findById(1);
  }

  @ApiOperation({
    summary: "get all devices from bus",
    description: "get all devices from bus",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "devices list", type: Array<Device> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: Bus })
  @Get(":id/devices")
  async devices(): Promise<Device[]> {
    return Promise.resolve([]);
  }

  @ApiOperation({
    summary: "create new bus",
    description: "create new bus",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "bus created", type: Bus })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Create, subject: Bus })
  @Put()
  async create(@Body() payload: Bus): Promise<unknown> {
    const bus = plainToClass(Bus, payload);
    return this.busService.insert(bus)
  }

  @ApiOperation({
    summary: "delete bus by id",
    description: "delete bus by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "bus removed", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Delete, subject: Bus })
  @Delete(':id')
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<unknown> {
    return this.busService.delete(id);
  }

  @ApiOperation({
    summary: "update bus by id",
    description: "get specific bus by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: Bus })
  @Post(':id')
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: Partial<Bus>,
  ): Promise<Bus> {
    return this.busService.update(id, payload);
  }
}
