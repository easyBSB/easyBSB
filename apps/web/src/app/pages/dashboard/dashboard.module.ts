import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./ui/dashboard.component";
import { BsbModule } from "src/app/libs/bsb/bsb.module";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    BsbModule,
    CommonModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
