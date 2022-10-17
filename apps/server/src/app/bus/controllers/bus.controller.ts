import { Actions, CheckAbility } from "@app/roles";
import { User } from "@app/users";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from 'class-transformer';
import { Bus } from "../model/bus.entity";
import { Device } from "../model/device.entity";
import { BsbStorage } from "../utils/bsb-store";
import { BusService } from "../utils/bus.service";
import { DeviceService } from "../utils/device.service";

@ApiTags("bus")
@Controller({
  path: "bus",
})
export class BusController {

  constructor(
    private readonly busService: BusService,
    private readonly deviceServie: DeviceService,
    private readonly bsbStorage: BsbStorage
  ) {}

  @ApiOperation({
    summary: "get list of bus",
    description: "get list of bus",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "bus list", type: Array<Bus> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: Bus })
  @Get()
  async busList(): Promise<unknown[]> {
    return this.busService.list();
  }

  @ApiOperation({
    summary: "get value by param id",
    description: "@todo add description",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @Get(":id/param/:paramId")
  async unknownName1(
    @Param("id", ParseIntPipe) id: Bus['id'],
    @Param("paramId", ParseIntPipe) paramId: number,
  ): Promise<string> {
    const bsb = this.bsbStorage.getById(id);
    const result = await bsb.get(paramId);

    try {
      if (result.length > 0) {
        return JSON.stringify({ data: result[0].value.toString() });
      }
    } catch (error) {
      return JSON.stringify({ data: result[0] });
    }

    return 'undefined';
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
  async devices(@Param("id", ParseIntPipe) id: Bus['id']): Promise<Device[]> {
    return this.deviceServie.list(id);
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
