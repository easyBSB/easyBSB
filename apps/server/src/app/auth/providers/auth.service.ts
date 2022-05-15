import { BadRequestException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { validate } from "class-validator"
import { compareSync, hashSync } from "bcryptjs"
import { JwtService } from '@nestjs/jwt'

import { UserService, User } from "@app/users";

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * @description login with given credentials
   */
  async login(username: string, password: string): Promise<string> {
    const user = await this.authenticateUser(username, password);
    if (user) {
      return this.jwtService.sign({ ...user })
    }
  }

  /**
   * @description register new user, throws 403 if username already has been taken
   */
  async register(name: string, password: string): Promise<User> {
    if (await this.validateParams(name, password)) {
      const user = await this.usersService.findOne(name)
      if (!user) {
        const result = await this.usersService.save({ name, password: hashSync(password, 10) })
        return this.usersService.findById(result.identifiers[0].id)
      }
      throw new HttpException(`A user with the name ${name} already exists`, 403)
    }
    throw new BadRequestException()
  }

  /**
   * @description login with given credentials
   */
  private async authenticateUser(username: string, pwd: string): Promise<Omit<User, 'password'>> {
    if (await this.validateParams(username, pwd)) {
      const user: User | undefined = await this.usersService.findOne(username)
      if (user && compareSync(pwd, user.password)) {
        const {password, ...easyBsbUser} = user
        return easyBsbUser
      }
      throw new UnauthorizedException('invalid username or password')
    }

    throw new BadRequestException();
  }

  /**
   * @description validate against dto
   */
  async validateParams(username: string, password): Promise<boolean> {
    const user = new User()
    user.name = username
    user.password = password

    let isValid = true

    await validate(user).then((errors) => {
      if (errors.length > 0) {
        isValid = false
      }
    })

    return isValid
  }
}
