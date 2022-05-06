import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserDto {

  @ApiProperty({ type: 'number' })
  id?: number;

  @ApiProperty({ type: 'string', example: 'easybsb' })
  @IsString()
  username: string

  @ApiProperty({ default: false, type: "boolean" })
  @IsBoolean()
  @IsOptional()
  userNeedPasswordChange?: boolean;

  @IsString()
  password: string
}
