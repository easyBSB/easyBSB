import { Injectable } from '@angular/core';
import { User, UserRoles } from '@app/libs/users';
import { AbilityBuilder } from '@casl/ability';
import { AppAbility, Subjects } from '../api';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private readonly ability: AppAbility
  ) {}

  /** 
   * @description define abilities for an authorized user
   */
  defineAbilities(user: User): void {
    const { can, rules } = new AbilityBuilder(AppAbility);
    switch(user.role) {
      case UserRoles.admin:
        can('manage', Subjects.Devices);
        can('manage', Subjects.User);
        break;

      case UserRoles.write:
      case UserRoles.read:
        can(['read', 'update'], Subjects.User);
        break
    }

    this.ability.update(rules);
  }

  clearAbilitys(): void {
    this.ability.update([]);
  }
}
