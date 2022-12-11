import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ConfirmDialogConfiguration, ConfirmDialogResponse } from '../public-api';

@Component({
  selector: 'easybsb-dialog-confirm',
  templateUrl: './confirm.dialog.html',
  styleUrls: ['./confirm.dialog.scss']
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly dialogData: ConfirmDialogConfiguration,
    private readonly dialogRef: MatDialogRef<ConfirmDialogComponent, ConfirmDialogResponse>
  ) {}

  public closeDialog(confirmed: boolean) {
    this.dialogRef.close({
      confirm: confirmed
    });
  }
}
