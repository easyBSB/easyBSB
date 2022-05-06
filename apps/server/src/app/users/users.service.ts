import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, InsertResult } from "typeorm"
import { UserEntity } from "./entities/user.entity"
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>
  ) { }

  findOne(name: string): Promise<UserEntity> {
    return this.repository.findOne({
      where: { name }
    })
  }

  async findById(id: number) : Promise<Omit<UserEntity, 'password'>> {
    const { password, ...user} = await this.repository.findOneBy({ id })
    return user
  }

  save(user: UserDto): Promise<InsertResult> {
    return this.repository.insert({
      name: user.username,
      password: user.password,
      userNeedPasswordChange: false
    })
  }
}
