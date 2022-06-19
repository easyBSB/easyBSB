import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";

import { HttpClientModule } from "@angular/common/http";
import { AuthorizationModule } from "./libs/authorization";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ErrorHandlerModule } from "./libs/error-handler/error-handler.module";
import { MessageModule } from "./libs/message/message.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthorizationModule,
    BrowserAnimationsModule,
    ErrorHandlerModule,
    BrowserModule,
    HttpClientModule,
    MatIconModule,
    MessageModule.forRoot()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
