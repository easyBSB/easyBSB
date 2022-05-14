import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { validate } from "class-validator"
import { compareSync, hashSync } from "bcryptjs"
import { JwtService } from '@nestjs/jwt'

import { UserService, User } from "@users/index";

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
    if (await this.authenticateUser(username, password)) {
      return this.jwtService.sign({ username })
    }
    throw new UnauthorizedException('invalid username or password')
  }

  /**
   * @description register new user, throws 403 if username already has been taken
   */
  async register(username: string, password: string): Promise<User> {
    if (await this.validateParams(username, password)) {
      const user = await this.usersService.findOne(username)
      if (!user) {
        const result = await this.usersService.save({ username, password: hashSync(password, 10) })
        return this.usersService.findById(result.identifiers[0].id)
      }
      throw new HttpException(`A user with the name ${username} already exists`, 403)
    }
    throw new BadRequestException()
  }

  /**
   * @description login with given credentials
   */
  private async authenticateUser(username: string, pwd: string): Promise<User> {
    if (await this.validateParams(username, pwd)) {
      const user = await this.usersService.findOne(username)
      if (!user) {
        throw new NotFoundException()
      }

      const {password, ...easyBsbUser} = user
      if (compareSync(pwd, password)) {
        return easyBsbUser
      }
      throw new ForbiddenException()
    }

    throw new BadRequestException();
  }

  /**
   * @description validate against dto
   */
  async validateParams(username: string, password): Promise<boolean> {
    const user = new User()
    user.username = username
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
