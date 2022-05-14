import { Module } from "@nestjs/common";
import { AbilityFactory } from "./providers/ability.factory";

@Module({
  providers: [ AbilityFactory ],
  exports: [ AbilityFactory ]
})
export class RolesModule {}
