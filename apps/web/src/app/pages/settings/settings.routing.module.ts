import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ABILITY_RESOLVER } from "../../core/permissions";
import { SettingRoutes } from "./constants/setting.routes";
import { settingsPermissionsResolver } from "./guards/settings-permission-resolver";

@NgModule({
  imports: [
    RouterModule.forChild(SettingRoutes)
  ],
  exports: [RouterModule],
  providers: [{
    provide: ABILITY_RESOLVER,
    useValue: settingsPermissionsResolver
  }]
})
export class SettingsRoutingModule {}
