import { Actions } from "@app/roles/constants/actions";
import { CheckAbility } from "@app/roles/utils/check-ability.decorator";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateUserAbility } from "../constants/abilities";
import { GetUser } from "../constants/get-user.decorator";
import { User } from "../entities/user";
import { UserService } from "../providers/users.service";

@ApiTags("users")
@Controller({
  path: "users",
})
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @CheckAbility({ action: Actions.Read, subject: User })
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.list();
  }

  @ApiOperation({
    summary: "add new user",
    description: "add new user by given username and password",
    security: [{ bearer: [] }],
  })
  @ApiHeaders([{ name: "Authorization", description: "Bearer auth token" }])
  @ApiBody({ required: true, type: User })
  @ApiResponse({ status: 201, description: "user registered", type: User })
  @ApiResponse({ status: 403, description: "usename allready taken" })
  @ApiResponse({ status: 403, description: "not allowed to create a new user" })
  @CheckAbility(CreateUserAbility)
  @Put()
  async newUser(@Body() payload: User): Promise<unknown> {
    if (!payload.password) {
      throw new BadRequestException("password missing");
    }
    return this.usersService.insert(payload);
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
  @CheckAbility({ action: Actions.Manage, subject: User })
  @Post(":id")
  async updateUser(
    @Param("id") userId: number,
    @Body() payload: User
  ): Promise<User> {
    return this.usersService.update(userId, payload);
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
  @CheckAbility({ action: Actions.Manage, subject: User })
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
}
