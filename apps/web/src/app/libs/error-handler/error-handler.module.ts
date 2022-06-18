import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from '../message/message.module';
import { ErrorInterceptor } from './error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    MessageModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorInterceptor
    }
  ],
})
export class ErrorHandlerModule {}