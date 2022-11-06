import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

import { MessageModule } from "@app/libs/message";
import { DialogModule } from "@app/libs/dialog";
import { ErrorHandlerModule } from "@app/libs/error-handler";
import { AuthorizationModule } from "@app/libs/authorization";
import { SidebarModule } from "@app/libs/sidebar";
import { I18NModule } from "@app/libs/i18n";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthorizationModule.forRoot(),
    DialogModule,
    CommonModule,
    ErrorHandlerModule,
    HttpClientModule,
    TranslateModule.forRoot({ isolate: false }),
    I18NModule.forRoot(),
    MessageModule.forRoot(),
    SidebarModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
