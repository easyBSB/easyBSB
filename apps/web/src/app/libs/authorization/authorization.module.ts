import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Router } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AuthorizationBearerInterceptor } from "./utils/authorization-bearer.interceptor";
import { applicationBootstrap } from "./utils/authorization.app-initializer";
import { LoginComponent } from "./ui/login.component";
import { AuthorizationService } from "./utils/authorization.service";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class AuthorizationModule {

  static forRoot(): ModuleWithProviders<AuthorizationModule> {

    return {
      ngModule: AuthorizationModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (
            router: Router,
            authService: AuthorizationService
          ) => {
            return () => applicationBootstrap(router, authService)
          },
          deps: [Router, AuthorizationService],
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthorizationBearerInterceptor,
          multi: true,
        },
      ]
    }
  }
}
