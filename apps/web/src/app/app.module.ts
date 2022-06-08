import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";

import { HttpClientModule } from "@angular/common/http";
import { AuthorizationModule } from "./libs/authorization";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthorizationModule,
    BrowserModule,
    HttpClientModule,
    MatIconModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
