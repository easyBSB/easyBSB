import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EasyBsbTraceModule } from './libs/trace/trace.module';
import { SocketIoModule } from 'ngx-socket-io';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    EasyBsbTraceModule,
    SocketIoModule.forRoot({
      url: 'http://localhost:3333'
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
