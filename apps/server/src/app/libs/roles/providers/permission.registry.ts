import { UserRoles } from "@lib/users";
import { Injectable } from "@nestjs/common";

export interface Permissions {
  create: boolean;
  read: boolean;
  update: boolean;
  destroy: boolean;
}

@Injectable()
export class PermissionsRegistry {

  private permissions: Map<UserRoles, string[]> = new Map();

  addAccess(role: UserRoles | UserRoles[], accessAuthorized: string[]): void {
    const roles = !Array.isArray(role) ? [role] : role;

    for (const role of roles) {
      if (!this.permissions.has(role)) {
        this.permissions.set(role, [])
      }

      // add everything 
      this.permissions.set(role, [
        ...this.permissions.get(role),
        ...accessAuthorized
      ])
    }
  }

  /**
   * get permission by user role
   */
  getPermissions(role: UserRoles): string[] {
    if (this.permissions.has(role)) {
      return this.permissions.get(role);
    }
    return [];
  }
}
