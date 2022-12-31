import { HttpContextToken } from "@angular/common/http";

export interface User {
  id: number | string;
  name: string;
  role: UserRoles;
  password?: string;
}

export interface UserListItem {
  isPhantom: boolean;
  mode: 'read' | 'write';
  raw: User;
}

export enum UserRoles {
  read  = "read",
  write = "write",
  admin = "admin"
}

export const HTTP_CONTEXT_USER = new HttpContextToken<User | undefined>(() => void 0);
