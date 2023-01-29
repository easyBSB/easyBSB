import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { AbilityModule } from "@casl/angular";

import { I18NModule } from "@easy-bsb/web/core/i18n";
import { PermissionsModule } from "@easy-bsb/web/core/permissions";
import { DialogModule } from "@easy-bsb/web/core/dialog";

import { UsersModule } from "@easy-bsb/web/lib/users";
import { NetworkModule } from "@easy-bsb/web/lib/network";

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
    AbilityModule,
    DialogModule
  ],
})
export class SettingsModule {}
