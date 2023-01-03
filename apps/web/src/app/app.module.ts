import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

// core modules
import { MessageModule } from "@app/core/message";
import { ErrorHandlerModule } from "@app/core/error-handler";
import { I18NModule } from "@app/core/i18n";

// libs
import { AuthorizationModule } from "@app/core/authorization";
import { SidebarModule } from "@app/libs/sidebar";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
