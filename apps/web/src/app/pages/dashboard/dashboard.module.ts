import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { I18NModule } from "@easy-bsb/web/core/i18n";

import { UsersModule } from "@easy-bsb/web/lib/users";
import { BsbModule } from "@easy-bsb/web/lib/bsb";

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
