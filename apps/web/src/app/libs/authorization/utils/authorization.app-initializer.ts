import { NavigationStart, Router } from "@angular/router";
import { Observable } from "rxjs";
import { concatMap, filter } from "rxjs/operators";
import { LoginComponent } from "../ui/login.component";
import { AuthorizationService } from "./authorization.service";

export function applicationBootstrap(
  router: Router,
  authService: AuthorizationService,
): Observable<unknown> {
  addLoginRoute(router);
  registerNavigationGuard(router, authService);
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
    component: LoginComponent,
  });
}

/**
 * @description register navigation guard, by default we could use a guard for all children
 * but this will triggers for every segment of the route which happens very often.
 * So we can avoid this one and listen to navigation change events which only matches for full 
 * route.
 */
function registerNavigationGuard(
  router: Router,
  authService: AuthorizationService
) {
  let checkRunning = false;
  router.events.pipe(
    filter((event) => {
      let handle = checkRunning === false;
      handle = handle && event instanceof NavigationStart;
      handle = handle && (event as NavigationStart).url !== '/login';
      return handle;
    }),
    concatMap(() => (checkRunning = true, authService.isAuthorized()))
  ).subscribe((isAuthorized) => {
    checkRunning = false;
    if (!isAuthorized) {
      router.navigate(["/login"]);
    }
  });
}
