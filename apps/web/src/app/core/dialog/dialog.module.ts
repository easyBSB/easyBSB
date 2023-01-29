import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { I18NModule } from '@easy-bsb/web/core/i18n';

import { BaseDialogComponent } from './base/base.dialog';
import { ConfirmDialogComponent } from './confirm/confirm.dialog';
import { DialogService } from './dialog.service';

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
