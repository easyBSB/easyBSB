import { ApiProperty } from "@nestjs/swagger";
import type { User } from "../../../users";

export class LoginResponseDto {
  @ApiProperty({ type: "string" })
  jwt: string;

  user: User;
}
