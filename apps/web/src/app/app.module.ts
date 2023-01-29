import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

// core modules
import { AuthorizationModule } from "./core/authorization";
import { ErrorHandlerModule } from "./core/error-handler";
import { I18NModule } from "./core/i18n";
import { MessageModule } from "./core/message";

// libs
import { SidebarModule } from "./libs/sidebar";

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
