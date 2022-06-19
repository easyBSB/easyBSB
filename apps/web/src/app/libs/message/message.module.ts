import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageService } from './message.service';

@NgModule({
  imports: [ MatSnackBarModule ]
})
export class MessageModule {

  public static forRoot(): ModuleWithProviders<MessageModule> {
    return {
      ngModule: MessageModule,
      providers: [MessageService]
    }
  }
}
