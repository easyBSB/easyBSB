import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./ui/dashboard.component";
import { BsbModule } from "src/app/libs/bsb/bsb.module";
import { I18NModule } from "@app/libs/i18n";

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
