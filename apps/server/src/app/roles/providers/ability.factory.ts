import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";

import { User, UserRoles } from "@app/users/entities/user";

import { Actions } from "../constants/actions";
import { AppAbility, Subjects } from "../api";

@Injectable()
export class AbilityFactory {
  defineAbility(user: User): AppAbility {
    const { build, can, cannot } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>
    );

    // should be role instead of userrole this is a bit duplicated
    switch (user.role) {
      case UserRoles.Admin:
        can(Actions.Manage, "all");
        break;

      // can not update users
      case UserRoles.Read:
      case UserRoles.Write:
        can(Actions.Read, User);
        can(Actions.Update, User, { id: user.id });
        cannot(Actions.Create, User).because("Forbidden");
        cannot(Actions.Delete, User).because('Forbidden');
        break;

    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
