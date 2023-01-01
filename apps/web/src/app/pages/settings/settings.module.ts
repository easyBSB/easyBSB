import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { AbilityModule } from "@casl/angular";

import { I18NModule } from "@app/core/i18n";
import { PermissionsModule } from "@app/core/permissions";

import { UsersModule } from "@app/libs/users";
import { NetworkModule } from "@app/libs/network";

import { SettingsComponent } from "./ui/settings.component";
import { SettingsRoutingModule } from "./settings.routing.module";

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
    AbilityModule
  ],
})
export class SettingsModule {}
