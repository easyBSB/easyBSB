import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './base/base.dialog';
import { ConfirmDialogComponent } from './confirm/confirm.dialog';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [
    BaseDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    PortalModule
  ],
  exports: [
    MatDialogModule
  ]
})
export class DialogModule {
}
