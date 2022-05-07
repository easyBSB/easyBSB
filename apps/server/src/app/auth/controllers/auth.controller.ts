import { Body, Controller, Head, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserDto } from "@users/dto/user.dto";
import { LoginDto } from "../api";
import { LoginResponseDto } from "../api/login-response.dto";
import { BypassAuthorization } from "../utils/bypass-authorization";
import { AuthService } from "../providers/auth.service";

@Controller({
  path: 'auth'
})
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ 
    summary: 'login',
    description: 'login user by given username and password',
  })
  @BypassAuthorization()
  @Post('login')
  @ApiResponse({ status: 201, description: 'genearted jwt token after successful login', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'authorization failed' })
  async login(@Body() param: LoginDto) {
    const jwt = await this.authService.login(param.username, param.password)
    return { jwt }
  }

  @ApiOperation({ 
    summary: 'register',
    description: 'register new user by given username and password',
  })
  @Post('register')
  @ApiResponse({ status: 201, description: 'user registered', type: UserDto })
  @ApiResponse({ status: 403, description: 'usename allready taken' })
  async register(@Body() param: LoginDto) {
    return await this.authService.register(param.username, param.password)
  }

  @ApiOperation({ 
    summary: 'authorized',
    description: 'head request to check we are authorized, this requires a bearer inside the authorization header',
  })
  @Head('authorized')
  @ApiResponse({ status: 200, description: 'authorized' })
  @ApiResponse({ status: 401, description: 'authorization failed' })
  async authorized() {
    return { status: 200 }
  }
}
