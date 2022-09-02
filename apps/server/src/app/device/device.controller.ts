import { Actions, CheckAbility } from "@app/roles";
import { User } from "@app/users";
import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Device } from "./device.entity";

@ApiTags("bus")
@Controller({
  path: "device",
})
export class DeviceController {

  constructor(
    /* private readonly deviceService: DeviceService */
  ) {}

  @ApiOperation({
    summary: "get list of users",
    description: "get list of users",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<Device> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Read, subject: User })
  @Get()
  async deviceList(): Promise<unknown[]> {
    throw "not implemented";
  }

  @ApiOperation({
    summary: "get device by id",
    description: "get specific bus by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<User> })
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
  @ApiResponse({ status: 200, description: "bus created", type: Device })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Create, subject: Device })
  @Put()
  async create(/* @Body() payload: Device */): Promise<unknown> {
    throw "not implemented";
  }

  @ApiOperation({
    summary: "delete bus by id",
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
  ): Promise<unknown> {
    throw "not implemented"
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
    /*
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: Partial<Device>,
    */
  ): Promise<Device> {
    throw "not implemented"
  }
}
