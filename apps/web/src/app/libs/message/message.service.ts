import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { concatMap, Subject } from "rxjs";
import { MessageType, Message, messageConfig } from "./constants";

@Injectable()
export class MessageService {
  private readonly message$: Subject<Message> = new Subject();

  constructor(private readonly snackbar: MatSnackBar) {
    this.registerEvents();
  }

  success(message: string) {
    this.message$.next({ text: message, type: MessageType.Success });
  }

  error(message: string) {
    this.message$.next({ text: message, type: MessageType.Error });
  }

  private registerEvents() {
    this.message$.pipe(
      concatMap((message) => this.snackbar
        .open(message.text, message.type, messageConfig)
        .afterDismissed()
      )
    ).subscribe();
  }
}
