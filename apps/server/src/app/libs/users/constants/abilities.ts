import { Actions, RoleRequirement } from "@easy-bsb/server/lib/roles";
import { User } from "../entities/user";

export const CreateUserAbility: RoleRequirement = {
  action: Actions.Create,
  subject: User,
};
