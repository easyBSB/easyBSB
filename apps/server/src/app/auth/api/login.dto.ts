import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ type: 'string', 'example': 'easybsb' })
  username: string;

  @ApiProperty({ type: 'string', 'example': 'easybsb' })
  password: string;
}
