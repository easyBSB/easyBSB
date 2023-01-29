import { LanguageKeys } from "@easy-bsb/parser";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from 'class-transformer';
import { ConnectionStorage, ConnectionFactory, EasybsbCategory } from "../../connection/public-api";
import { CheckAbility, Actions } from "../../roles";
import { User } from "../../users";
import { Device } from "../model/device.entity";
import { BusService } from "../utils/bus.service";
import { DeviceService } from "../utils/device.service";
import { Bus } from "../model/bus.entity";

@ApiTags("bus")
@Controller({
  path: "bus",
})
export class BusController {

  constructor(
    private readonly busService: BusService,
    private readonly deviceServie: DeviceService,
    private readonly connectionStorage: ConnectionStorage,
    private readonly connectionFactory: ConnectionFactory,
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

  @Get(':id/categories')
  public getCategories(
    @Param('id', ParseIntPipe) busId: Bus['id'],
    @Query() query: { lang: LanguageKeys } 
  ): Record<string, EasybsbCategory> {
    const connection = this.connectionStorage.get(busId);
    if (connection) {
      return connection.getConfiguration(query.lang);
    }
    return {}
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
    const connection = this.connectionStorage.get(id);
    const result = await connection.getParam(paramId);

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
    @Param("id", ParseIntPipe) busId: number,
    @Body() payload: Partial<Bus>,
  ): Promise<Bus> {

    // params for reconnect
    const origin = await this.busService.findById(busId);
    const {name, id, ...rest } = payload;

    const bus = await this.busService.update(busId, payload);

    // test we have changed some properties which requires a reconnect 
    let requireReconnect = false;
    for (const [key, value] of Object.entries(origin)) {
      requireReconnect = requireReconnect || (rest[key] !== undefined && rest[key] !== value);
    }

    if (requireReconnect) {
      const connection = this.connectionStorage.get(bus.id);
      connection.disconnect();

      this.connectionStorage.remove(bus.id);
      const devices = await this.deviceServie.list(bus.id);

      const newConnection = this.connectionFactory.create(bus, devices[0]);
      this.connectionStorage.register(newConnection);
      newConnection.connect();
    }

    return bus;
  }
}
