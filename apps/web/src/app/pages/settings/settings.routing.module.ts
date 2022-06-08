import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SettingRoutes } from "./constants/setting.routes";

@NgModule({
  imports: [RouterModule.forChild(SettingRoutes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
