import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { compareSync } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

import { LoginResponseDto } from "../api";
import { UserService, User } from "../../../users";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * @description login with given credentials
   */
  async login(username: string, password: string): Promise<LoginResponseDto> {
    const user = await this.authenticateUser(username, password);
    const token = this.jwtService.sign({ ...user });
    return { jwt: token, user };
  }

  /**
   * @description login with given credentials
   */
  private async authenticateUser(
    username: string,
    pwd: string
  ): Promise<Omit<User, "password">> {
    if (await this.validateParams(username, pwd)) {
      const user: User | undefined = await this.usersService.findOne(username);
      if (user && compareSync(pwd, user.password)) {
        const { password, ...easyBsbUser } = user;
        return easyBsbUser;
      }
      throw new UnauthorizedException("invalid username or password");
    }

    throw new BadRequestException();
  }

  /**
   * @description validate against dto
   */
  async validateParams(username: string, password): Promise<boolean> {
    const user = new User();
    user.name = username;
    user.password = password;

    let isValid = true;

    await validate(user).then((errors) => {
      if (errors.length > 0) {
        isValid = false;
      }
    });

    return isValid;
  }
}
