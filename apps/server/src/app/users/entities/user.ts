import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator"
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRoles {
  REQUIRE_PASSWORD_CHANGE = 'require_password_change',
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

@Entity()
export class User {

  @ApiProperty({ type: 'number' })
  @PrimaryGeneratedColumn()
  id?: number

  @ApiProperty({ type: 'string', example: 'easybsb' })
  @IsString()
  @Column({ unique: true })
  username: string

  @ApiProperty({ default: false, type: "boolean" })
  @IsBoolean()
  @IsOptional()
  @Column()
  userNeedPasswordChange?: boolean

  @IsString()
  @Column()
  password?: string

  @ApiProperty({ type: 'enum', enum: UserRoles, example: UserRoles.READ })
  @IsEnum(UserRoles)
  @IsOptional()
  @Column({ default: UserRoles.READ, enum: UserRoles})
  userrole?: UserRoles
}
