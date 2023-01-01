import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { I18NModule } from "@app/core/i18n";

import { BsbModule } from "src/app/libs/bsb/bsb.module";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./ui/dashboard.component";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    BsbModule,
    CommonModule,
    DashboardRoutingModule,
    I18NModule
  ],
})
export class DashboardModule {}
