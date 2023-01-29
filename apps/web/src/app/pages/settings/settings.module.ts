import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { AbilityModule } from "@casl/angular";

import { I18NModule } from "../../core/i18n";
import { PermissionsModule } from "../../core/permissions";
import { NetworkModule } from "../../libs/network";
import { UsersModule } from "../../libs/users";

import { SettingsComponent } from "./ui/settings.component";
import { SettingsRoutingModule } from "./settings.routing.module";
import { DialogModule } from "@angular/cdk/dialog";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    NetworkModule,
    UsersModule,
    I18NModule,
    PermissionsModule,
    AbilityModule,
    DialogModule
  ],
})
export class SettingsModule {}
