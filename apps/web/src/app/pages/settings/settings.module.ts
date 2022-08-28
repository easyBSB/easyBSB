import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { SettingsComponent } from "./ui/settings.component";
import { SettingsRoutingModule } from "./settings.routing.module";
import { UsersModule } from "../../libs/users/users.module";
import { BusModule } from "src/app/libs/bus/bus.module";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    BusModule,
    UsersModule,
  ],
  providers: [],
})
export class SettingsModule {}
