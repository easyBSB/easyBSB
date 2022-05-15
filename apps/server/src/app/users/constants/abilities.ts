import { Actions, RoleRequirement } from "@app/roles";
import { User } from "../entities/user";

export const CreateUserAbility: RoleRequirement = {
  action: Actions.Create,
  subject: User
}
