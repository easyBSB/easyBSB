import { ComponentType } from "@angular/cdk/portal";

export enum DialogType {
  CONFIRM
};


export interface BaseDialogConfiguration {
  title: string;
}

export interface ConfirmDialogConfiguration extends BaseDialogConfiguration {
  confirmText: string;
  cancelText: string;
  message: string;
}

export interface ConfirmDialogResponse  {
  confirm: boolean;
}

export interface DialogData extends BaseDialogConfiguration {
  content: ComponentType<unknown>;
}