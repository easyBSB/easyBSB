import { MatSnackBarConfig } from "@angular/material/snack-bar";

export enum MessageType {
  Error = 'Error',
  Info = 'Info',
  Success = 'Success',
  Warning = 'Warning',
}

export interface Message {
  text: string;
  type: MessageType;
}

export const messageConfig: MatSnackBarConfig = {
  duration: void 0,
  verticalPosition: 'bottom',
  horizontalPosition: 'right'
}
