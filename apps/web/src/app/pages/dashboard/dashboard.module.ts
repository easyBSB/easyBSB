import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboadComponent } from './ui/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [ DashboadComponent ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
})
export class DashboardModule {}