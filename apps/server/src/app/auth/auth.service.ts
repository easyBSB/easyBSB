import { BadRequestException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { validate } from "class-validator"
import { compareSync, hashSync } from "bcrypt"
import { JwtService } from '@nestjs/jwt'

import { UserService, UserDto, UserEntity } from "@users/index";

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
    throw new UnauthorizedException('username or password wrong')
  }

  /**
   * @description register new user, throws 403 if username allready has been taken
   */
  async register(username: string, password: string): Promise<Omit<UserEntity, 'password'>> {
    if (await this.validateParams(username, password)) {
      const user = await this.usersService.findOne(username)
      if (!user) {
        const result = await this.usersService.save({ username, password: hashSync(password, 10) })
        return this.usersService.findById(result.identifiers[0].id)
      }
      throw new HttpException(`A user with the name ${username} allready exists`, 403)
    }
    throw new BadRequestException()
  }

  /**
   * @description login with given credentials
   */
  private async authenticateUser(username: string, password: string): Promise<boolean> {
    let isValid = await this.validateParams(username, password)
    if (isValid) {
      const user = await this.usersService.findOne(username)
      if (!user) {
        return null
      }

      isValid = compareSync(password, user.password)
    }
    return isValid
  }

  /**
   * @description validate against dto
   */
  async validateParams(username: string, password: string): Promise<boolean> {
    const userDto = new UserDto()
    userDto.username = username
    userDto.password = password

    let isValid = true

    await validate(userDto).then((errors) => {
      if (errors.length > 0) {
        isValid = false
      }
    })

    return isValid
  }
}
