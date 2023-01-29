import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { I18NModule } from "../../core/i18n";
import { BsbModule } from "../../libs/bsb";
import { UsersModule } from "../../libs/users";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./ui/dashboard.component";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    BsbModule,
    CommonModule,
    DashboardRoutingModule,
    I18NModule,
    UsersModule
  ],
})
export class DashboardModule {}
