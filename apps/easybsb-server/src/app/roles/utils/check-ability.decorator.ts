import { SetMetadata } from "@nestjs/common";

import { Subjects } from "../api";
import { Actions } from "../constants/actions";

export interface RoleRequirement {
  action: Actions,
  subject: Subjects
}

export const EASYBSB_ROLE_CHECK = 'easybsb-role-check'
export const CheckAbility = (...req: RoleRequirement[]) => SetMetadata(EASYBSB_ROLE_CHECK, req)