import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { LoginPageGuard } from "../guards/login-page";
import { LoginComponent } from "../ui/login.component";
import { AuthorizationService } from "./authorization.service";

export function applicationBootstrap(
  router: Router,
  authService: AuthorizationService,
): Observable<unknown> {
  addLoginRoute(router);
  return authService.loadSessionState();
}

function addLoginRoute(router: Router): void {
  const routerConfig = router.config;
  let index = routerConfig.length - 1;

  for (; index > 0; index--) {
    const route = routerConfig[index];
    if (route.path !== "**") {
      break;
    }
  }

  // attach our own route to configuration before ** route
  routerConfig.splice(index + 1, 0, {
    path: "login",
    canActivate: [LoginPageGuard],
    component: LoginComponent,
  });
}
