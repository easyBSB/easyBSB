import { NgModule } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { I18NModule } from '@app/libs/i18n';

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
