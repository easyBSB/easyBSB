import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { EasyBsbTraceModule } from './libs/trace/trace.module';
import { SocketIoModule } from 'ngx-socket-io';
import { AuthorizationModule } from './libs/authorization';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthorizationModule,
    BrowserModule,
    EasyBsbTraceModule,
    HttpClientModule,
    SocketIoModule.forRoot({
      url: 'http://localhost:3333'
    })
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
