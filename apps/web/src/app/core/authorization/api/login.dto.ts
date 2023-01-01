import { User } from "../../../interfaces/users";

export interface LoginDto {
  username: string;

  password: string;
}

export interface LoginResponseDto {
  jwt: string;
  user: User
}
