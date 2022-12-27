import { Body, Controller, Get, Head, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "../api";
import { LoginResponseDto } from "../api/login-response.dto";
import { BypassAuthorization } from "../utils/bypass-authorization";
import { AuthService } from "../providers/auth.service";
import { LoggedInUser } from "@core/decorators";
import { User } from "@lib/users";

@ApiTags("auth")
@Controller({
  path: "auth",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "login",
    description: "login user by given username and password",
  })
  @BypassAuthorization()
  @Post("login")
  @ApiResponse({
    status: 201,
    description: "genearted jwt token after successful login",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "authorization failed" })
  async login(@Body() param: LoginDto) {
    return await this.authService.login(param.username, param.password);
  }

  @ApiOperation({
    summary: "authorized user",
    description: "current authorized user",
  })
  @Get("user")
  @ApiResponse({
    status: 200,
    description: "current authorized user",
    type: User,
  })
  @ApiResponse({ status: 401, description: "not authorized" })
  async user(@LoggedInUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: "authorized",
    description:
      "head request to check we are authorized, this requires a bearer inside the authorization header",
    security: [{ bearer: [] }],
  })
  @Head("authorized")
  @ApiResponse({ status: 200, description: "authorized" })
  @ApiResponse({ status: 401, description: "authorization failed" })
  async authorized() {
    return { status: 200 };
  }
}
