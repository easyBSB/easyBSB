import { User } from "@app/users";
import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({ type: "string" })
  jwt: string;

  user: User;
}
