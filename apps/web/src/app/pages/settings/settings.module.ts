import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { UsersModule } from "@app/libs/users";
import { NetworkModule } from "@app/libs/network";
import { SettingsComponent } from "./ui/settings.component";
import { SettingsRoutingModule } from "./settings.routing.module";
import { I18NModule } from "@app/libs/i18n";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    NetworkModule,
    UsersModule,
    I18NModule
  ],
  providers: [],
})
export class SettingsModule {}
