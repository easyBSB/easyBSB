import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardRoutes } from './constants/routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  exports: [],
  providers: [],
})
export class DashboardRoutingModule {}
