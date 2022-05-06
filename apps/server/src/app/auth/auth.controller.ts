import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserDto } from "@users/dto/user.dto";
import { LoginDto } from "./api";
import { LoginResponseDto } from "./api/login-response.dto";
import { AuthService } from "./auth.service";

@Controller({
  path: 'auth'
})
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ 
    summary: 'login',
    description: 'login user by given username and password',
  })
  @ApiResponse({ status: 201, description: 'genearted jwt token after successful login', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'authorization failed' })
  @Post('login')
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
}
