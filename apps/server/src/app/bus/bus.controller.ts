import { Actions, CheckAbility } from "@app/roles";
import { User } from "@app/users";
import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from 'class-transformer';
import { Bus } from "./bus.entity";
import { BusService } from "./bus.service";

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
  async busById(): Promise<unknown> {
    return this.busService.findById(1);
  }

  @ApiOperation({
    summary: "get bus by id",
    description: "get specific bus by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Create, subject: Bus })
  @Put()
  async createBus(@Body() payload: Bus): Promise<unknown> {
    const bus = plainToClass(Bus, payload);
    /** convert payload to bus */
    return this.busService.insert(bus)
  }

  @ApiOperation({
    summary: "get bus by id",
    description: "get specific bus by id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "users list", type: Array<User> })
  @ApiResponse({ status: 401, description: "not authorized" })
  @CheckAbility({ action: Actions.Delete, subject: Bus })
  @Delete(':id')
  async deleteBus(): Promise<unknown> {
    return [{
      name: 'bus',
      address: 'foobar'
    }];
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
  @Post(':id')
  async updateBus(): Promise<unknown> {
    return [{
      name: 'bus',
      address: 'foobar'
    }];
  }
}
