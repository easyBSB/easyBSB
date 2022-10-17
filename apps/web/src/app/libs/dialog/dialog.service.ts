import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogConfiguration, ConfirmDialogConfiguration, ConfirmDialogResponse, DialogType } from './api/dialog-type';
import { BaseDialogComponent } from './base/base.dialog';
import { ConfirmDialogComponent } from './confirm/confirm.dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private readonly matDialog: MatDialog,
  ) {}

  openDialog<T = ConfirmDialogConfiguration>(type: DialogType.CONFIRM, config: T): MatDialogRef<T, ConfirmDialogResponse>;
  openDialog(type: DialogType, config: BaseDialogConfiguration): MatDialogRef<unknown> {
    let componentRef: ComponentType<unknown>;
    switch (type) {
      case DialogType.CONFIRM:
        componentRef = ConfirmDialogComponent;
        break;

      default:
        throw `unknown dialog type`;
    }

    return this.matDialog.open(BaseDialogComponent, {
      width: '20rem',
      data: {
        content: componentRef,
        ...config
      }
    });
  }
}
