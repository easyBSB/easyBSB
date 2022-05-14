import { Body, Controller, ForbiddenException, Head, Post, Request } from "@nestjs/common";
import { ApiHeaders, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "../api";
import { LoginResponseDto } from "../api/login-response.dto";
import { BypassAuthorization } from "../utils/bypass-authorization";
import { AuthService } from "../providers/auth.service";
import { User } from "@app/users";
import { Actions, AbilityFactory } from "@app/roles";

@ApiTags('auth')
@Controller({
  path: 'auth'
})
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

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
    security: [{ bearer: [] }]
  })
  @ApiHeaders([ { name: 'Authorization', description: 'Bearer auth token' } ])
  @Post('register')
  @ApiResponse({ status: 201, description: 'user registered', type: User })
  @ApiResponse({ status: 403, description: 'usename allready taken' })
  async register(@Body() param: LoginDto, @Request() req) {

    // find ich nun gar nicht so toll hier an der Stelle das sollte on top passieren
    const ability = this.abilityFactory.defineAbility(req.user)
    const isAllowed = ability.can(Actions.Create, User)

    if (isAllowed) {
      return await this.authService.register(param.username, param.password)
    }

    throw new ForbiddenException('Not allowed to add new users')
  }

  @ApiOperation({ 
    summary: 'authorized',
    description: 'head request to check we are authorized, this requires a bearer inside the authorization header',
    security: [{ bearer: [] }]
  })
  @Head('authorized')
  @ApiResponse({ status: 200, description: 'authorized' })
  @ApiResponse({ status: 401, description: 'authorization failed' })
  async authorized() {
    return { status: 200 }
  }
}
