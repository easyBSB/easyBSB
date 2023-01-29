import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';

import { BaseDialogComponent } from './base/base.dialog';
import { ConfirmDialogComponent } from './confirm/confirm.dialog';
import { DialogService } from './dialog.service';
import { I18NModule } from '../../i18n';

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
  providers: [
    DialogService,
  ],
  exports: [
    MatDialogModule
  ]
})
export class DialogModule {
}
