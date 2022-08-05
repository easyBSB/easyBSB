import { User } from "../../users/api";

export interface LoginDto {
  username: string;

  password: string;
}

export interface LoginResponseDto {
  jwt: string;
  user: User
}
