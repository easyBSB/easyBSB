import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { I18NModule } from '@app/core/i18n';

import { BaseDialogComponent } from './base/base.dialog';
import { ConfirmDialogComponent } from './confirm/confirm.dialog';

@NgModule({
  declarations: [
    BaseDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    PortalModule,
    I18NModule
  ],
  exports: [
    MatDialogModule
  ]
})
export class DialogModule {
}
