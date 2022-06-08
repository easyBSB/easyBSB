import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsComponent } from "./ui/settings.component";
import { SettingsRoutingModule } from "./settings.routing.module";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ],
  providers: [],
})
export class SettingsModule {}
