import { APP_INITIALIZER, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Router } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AuthorizationBearerInterceptor } from "./utils/authorization-bearer.interceptor";
import { authorizationAppInitializer } from "./utils/authorization.app-initializer";
import { LoginComponent } from "./ui/login.component";

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationBearerInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (router: Router) => {
        return () => authorizationAppInitializer(router);
      },
      deps: [Router],
      multi: true,
    },
  ],
})
export class AuthorizationModule {}
