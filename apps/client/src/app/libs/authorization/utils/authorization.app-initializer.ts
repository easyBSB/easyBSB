import { Router } from "@angular/router";
import { LoginComponent } from "../ui/login.component";

export function authorizationAppInitializer(router: Router): void {
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
