import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { SettingsComponent } from "./ui/settings.component";
import { SettingsRoutingModule } from "./settings.routing.module";
import { UsersComponent } from "../../components/users/users.component";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    UsersComponent
  ],
  providers: [],
})
export class SettingsModule {}
