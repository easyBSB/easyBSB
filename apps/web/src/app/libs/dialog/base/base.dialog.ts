import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../public-api';

@Component({
  selector: 'easybsb-base-dialog',
  templateUrl: './base.dialog.html',
  styleUrls: ['./base.dialog.scss']
})
export class BaseDialogComponent implements OnInit {

  @ViewChild('portalHost', { read: CdkPortalOutlet, static: true })
  public selectedPortal!: CdkPortalOutlet;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly dialogData: DialogData, 
    private readonly viewRef: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    const componentPortal = new ComponentPortal(this.dialogData.content, this.viewRef);
    this.selectedPortal?.attach(componentPortal);
  }
}
