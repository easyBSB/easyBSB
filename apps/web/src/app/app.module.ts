import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AuthorizationModule } from "./libs/authorization";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { MessageModule } from "./libs/message/message.module";
import { ErrorHandlerModule } from "./libs/error-handler/error-handler.module";
import { SidebarModule } from "./libs/sidebar/sidebar.module";
import { CommonModule } from "@angular/common";
import { DialogModule } from "@app/libs/dialog";

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    AuthorizationModule.forRoot(),
    ErrorHandlerModule,
    HttpClientModule,
    MessageModule.forRoot(),
    SidebarModule,
    DialogModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
