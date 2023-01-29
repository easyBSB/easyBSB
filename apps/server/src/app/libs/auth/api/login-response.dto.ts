import { User } from "@easy-bsb/server/lib/users";
import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({ type: "string" })
  jwt: string;

  user: User;
}
