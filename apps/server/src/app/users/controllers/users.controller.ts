import { Actions } from "@app/roles/constants/actions";
import { CheckAbility } from "@app/roles/utils/check-ability.decorator";
import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiHeaders, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CreateUserAbility } from "../constants/abilities";
import { User } from "../entities/user";
import { UserService } from "../providers/users.service";

@Controller({
  path: 'users'
})
export class UsersController {

  constructor(private readonly usersService: UserService) {}

  @CheckAbility({ action: Actions.Read, subject: User})
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.list()
  }

  @ApiOperation({ 
    summary: 'add new user',
    description: 'add new user by given username and password',
    security: [{ bearer: [] }]
  })
  @ApiHeaders([ { name: 'Authorization', description: 'Bearer auth token' } ])
  @ApiBody({ required: true, type: User })
  @ApiResponse({ status: 201, description: 'user registered', type: User })
  @ApiResponse({ status: 403, description: 'usename allready taken' })
  @ApiResponse({ status: 403, description: 'not allowed to create a new user' })
  @CheckAbility(CreateUserAbility)
  @Post()
  async newUser(@Body() payload: User): Promise<unknown> {
    if (!payload.password) {
      throw new BadRequestException('password missing')
    }
    return this.usersService.save(payload);
  }

  @CheckAbility({ action: Actions.Manage, subject: User})
  @Delete(':id')
  async deleteUser(@Param('id') userId: number): Promise<void> {
    console.log(userId);
  }
}
