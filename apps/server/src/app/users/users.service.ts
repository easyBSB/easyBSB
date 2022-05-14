import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, InsertResult } from "typeorm"
import { User } from "./entities/user"

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) { }

  findOne(username: string): Promise<User | null> {
    return this.repository.findOne({
      where: { username }
    })
  }

  async findById(id: number) : Promise<User> {
    const { password, ...user} = await this.repository.findOneBy({ id })
    return user
  }

  save(user: User): Promise<InsertResult> {
    return this.repository.insert({
      ...user,
      userNeedPasswordChange: false
    })
  }
}
