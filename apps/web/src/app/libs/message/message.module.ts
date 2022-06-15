import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageService } from './message.service';

@NgModule({
  imports: [ MatSnackBarModule ],
  providers: [ MessageService ],
})
export class MessageModule {}
