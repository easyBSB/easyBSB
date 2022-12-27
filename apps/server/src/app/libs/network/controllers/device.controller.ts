import { Actions, CheckAbility } from "@lib/roles";
import { User } from "@lib/users";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { Device } from "../model/device.entity";
import { DeviceService } from "../utils/device.service";

@ApiTags("device")
@Controller({
  path: "device",
})
export class DeviceController {

  constructor(
    private readonly deviceService: DeviceService
  ) {}

  @ApiOperation({
    summary: "get device by id",
    description: "get specific device by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "device entity", type: Device })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: Device })
  @Get(":id")
  async busById(): Promise<unknown> {
    throw "not implemented";
  }

  @ApiOperation({
    summary: "create new device",
    description: "create new device",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "device created", type: Device })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Create, subject: Device })
  @Put()
  async create(@Body() payload: Device): Promise<Device> {
    const { id, ...data } = payload;
    const device = plainToClass(Device, data);
    return this.deviceService.insert(device);
  }

  @ApiOperation({
    summary: "delete device by id",
    description: "delete bus by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "bus removed", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Delete, subject: Device })
  @Delete(':id')
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deviceService.delete(id);
  }

  @ApiOperation({
    summary: "update device by id",
    description: "get specific device by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: Device })
  @Post(':id')
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: Partial<Device>,
  ): Promise<Device> {
    return this.deviceService.update(id, payload);
  }
}
