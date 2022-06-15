export interface User {
  id: number | string;
  name: string;
  role: string;
  password?: string;
}

export interface UserListItem {
  isPhantom: boolean;
  mode: 'read' | 'write';
  raw: User;
}

export enum UserRoles {
  read  = "Read",
  write = "Write",
  admin = "Admin"
}
