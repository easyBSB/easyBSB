import { User } from "@lib/users";
import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({ type: "string" })
  jwt: string;

  user: User;
}
