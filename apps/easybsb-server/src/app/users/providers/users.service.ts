import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { hashSync } from "bcryptjs"
import { validate } from "class-validator"
import { Repository } from "typeorm"
import { User } from "../entities/user"

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) { }

  findOne(name: string): Promise<User | null> {
    return this.repository.findOne({ where: { name } })
 }

  async findById(id: number) : Promise<User | null> {
    const user = await this.repository.findOneBy({ id })
    if (user) {
      const {password, ...data} = user 
      return data
    }
    return null
  }

  async list(): Promise<User[]> {
    const users = await this.repository.find()
    if (users.length > 0) {
      return users.map((user) => {
        const {password, ...data} = user
        return data;
      })
    }
    return []
  }

  async save(payload: Partial<User>): Promise<User> {
    const isValid = await this.validateParams(payload)

    if (!isValid) {
      throw new BadRequestException()
    }

    const user: User = await this.findOne(payload.name)
    if (user) {
      throw new ForbiddenException(`A user with the name ${user.name} already exists`)
    }

    try {
      if (payload.password && payload.password.trim() !== '') {
        payload.password = hashSync(payload.password);
      }

      const result = await this.repository.insert({ ...payload, needPasswordChange: false })
      const lastInsertedId = result.identifiers.at(0).id
      return this.findById(lastInsertedId)
    } catch(error) {
      throw new BadRequestException(error.message)
    }
  }

  private async validateParams(values: Partial<User>): Promise<boolean> {
    const user = new User();
    Object.entries(values).forEach(([key, value]) => {
      user[key] = value
    })

    return validate(user).then((errors) => errors.length === 0)
  }
}
