import { IsString } from 'class-validator'

export class UsersDTO {

  @IsString()
  username: string

  @IsString()
  password: string
}
