import { ForbiddenError } from "@casl/ability";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiBody, ApiTags } from "@nestjs/swagger";
import { AbilityFactory, Actions, CheckAbility } from "@lib/roles";
import { FindManyOptions } from "typeorm";
import { GetUser } from "../constants/get-user.decorator";
import { User, UserRoles } from "../entities/user";
import { UserService } from "../providers/users.service";


@ApiTags("users")
@Controller({
  path: "users",
})
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly abilityFactory: AbilityFactory
  ) {}

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
  async getUsers(
    @GetUser() user: User,
  ): Promise<Omit<User, 'password'>[]> {
    let filter: FindManyOptions<User> = {};
    if (user.role !== UserRoles.Admin) {
      filter = {
        where: { id: user.id }
      };
    }

    const list = await this.usersService.list(filter);
    return this.sanitizeResponse(list);
  }

  @ApiOperation({
    summary: "add new user",
    description: "add new user by given username and password",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiBody({ required: true, type: User })
  @ApiResponse({ status: 200, description: "user registered", type: User })
  @ApiResponse({ status: 403, description: "usename allready taken" })
  @ApiResponse({ status: 403, description: "not allowed to create a new user" })
  @CheckAbility({ action: Actions.Create, subject: User })
  @Put()
  async newUser(@Body() payload: User): Promise<User> {
    if (!payload.password) {
      throw new BadRequestException("password missing");
    }
    const insertedUser = await this.usersService.insert(payload);
    return this.sanitizeResponse(insertedUser)[0];
  }

  @ApiOperation({
    summary: "update user",
    description: "update user by given id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiBody({ required: true, type: User })
  @ApiResponse({ status: 201, description: "user updated", type: User })
  @ApiResponse({ status: 403, description: "not allowed to update a user" })
  @ApiResponse({ status: 404, description: "user not for update not found" })
  @Post(":id")
  async updateUser(
    @Param("id", ParseIntPipe) userId: number,
    @Body() payload: Partial<User>,
    @GetUser() user: User,
  ): Promise<User> {
    if (user.id === userId && payload.role && user.role !== payload.role) {
      throw new ForbiddenException(`Not allowed to change own role.`);
    }

    if (user.id === userId && payload.name && user.name !== payload.name) {
      throw new ForbiddenException(`Not allowed to change own name.`);
    }

    try {
      const userToUpdate = await this.usersService.findById(userId);
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, userToUpdate);

      const updatedUser = await this.usersService.update(userId, payload);
      return this.sanitizeResponse(updatedUser)[0];
    } catch (error) {
      throw new ForbiddenException(`Forbidden.`);
    }
  }

  @ApiOperation({
    summary: "delete user",
    description: "delete user by given id",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiResponse({ status: 200, description: "user deleted"})
  @ApiResponse({ status: 403, description: "not allowed to delete a user" })
  @ApiResponse({ status: 404, description: "user not found" })
  @CheckAbility({ action: Actions.Delete, subject: User })
  @Delete(":id")
  async deleteUser(
    @Param("id", ParseIntPipe) userId: number,
    @GetUser() user: User,
  ): Promise<void> {
    if (user.id === userId) {
      throw new BadRequestException(`Not allowed to remove yourself`);
    }
    return this.usersService.delete(userId);
  }

  private sanitizeResponse(user: User | User[]): User[] {
    const users = Array.isArray(user) ? user : [user];
    const response = users.map((user: User) => {
      const { password, ...rest } = user;
      return rest;
    })
    return response;
  }
}
