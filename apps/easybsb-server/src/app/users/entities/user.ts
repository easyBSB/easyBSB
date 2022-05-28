import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRoles {
  RequirePasswordChange = "require_password_change",
  Read = "read",
  Write = "write",
  Admin = "admin",
}

@Entity()
export class User {
  @ApiProperty({ type: "number" })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ type: "string", example: "easybsb" })
  @IsString()
  @Column({ unique: true })
  name: string;

  @ApiProperty({ default: false, type: "boolean" })
  @IsBoolean()
  @IsOptional()
  @Column()
  needPasswordChange?: boolean;

  @IsString()
  @Column()
  password?: string;

  @ApiProperty({ type: "enum", enum: UserRoles, example: UserRoles.Read })
  @IsEnum(UserRoles)
  @IsOptional()
  @Column({ type: "varchar", default: UserRoles.Read, enum: UserRoles })
  role?: UserRoles;
}
