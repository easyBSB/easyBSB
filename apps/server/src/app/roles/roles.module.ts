import { Module } from "@nestjs/common";
import { AbilityFactory } from "./providers/ability.factory";
import { RoleGuard } from "./utils/role.guard";

@Module({
  providers: [ AbilityFactory, RoleGuard ],
  exports: [ AbilityFactory, RoleGuard ]
})
export class RolesModule {}
