import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

// core modules
import { MessageModule } from "@app/core/message";
import { ErrorHandlerModule } from "@app/core/error-handler";
import { I18NModule } from "@app/core/i18n";

// libs
import { AuthorizationModule } from "@app/core/authorization";
import { SidebarModule } from "@app/libs/sidebar";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { DialogModule } from "@app/core/dialog";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthorizationModule.forRoot(),
    CommonModule,
    ErrorHandlerModule,
    HttpClientModule,
    TranslateModule.forRoot({ isolate: false }),
    MessageModule.forRoot(),
    SidebarModule,
    I18NModule.forRoot(),
    DialogModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
