import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthorizationBearerInterceptor } from './utils/authorization-beaerer.interceptor';
import { authorizationAppInitializer } from './utils/authorization.app-initializer';

@NgModule({
  declarations: [],
  imports: [ CommonModule ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationBearerInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (router: Router) => {
        return () => authorizationAppInitializer(router)
      },
      deps: [Router],
      multi: true
    }
  ],
})
export class AuthorizationModule {}
