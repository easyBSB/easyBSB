import { Body, Controller, Post } from "@nestjs/common";
import { UsersDTO } from "@users/index";
import { AuthService } from "./auth.service";

declare type AuthParam = {[k in keyof UsersDTO]: UsersDTO[k]}

@Controller({
  path: 'auth'
})
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() param: AuthParam) {
    return this.authService.login(param.username, param.password)
  }

  @Post('register')
  async register(@Body() param: AuthParam) {
    return await this.authService.register(param.username, param.password)
  }
}
