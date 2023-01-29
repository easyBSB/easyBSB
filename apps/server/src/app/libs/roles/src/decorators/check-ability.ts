import { SetMetadata } from "@nestjs/common";
import { RoleRequirement } from "../api";
import { EASYBSB_ROLE_CHECK } from "../constants";

export const CheckAbility = (...req: RoleRequirement[]) =>
  SetMetadata(EASYBSB_ROLE_CHECK, req);