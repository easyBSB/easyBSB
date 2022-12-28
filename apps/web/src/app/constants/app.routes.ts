import { Route } from "@angular/router";
import { AuthorizationGuard } from "@app/libs/authorization";

export const AppRoutes: Route[] = [
  {
    path: "",
    canActivateChild: [ AuthorizationGuard ],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("../pages/dashboard/dashboard.module").then(
            (module) => module.DashboardModule
          ),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("../pages/settings/settings.module").then(
            (module) => module.SettingsModule
          ),
      },
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
    ],
  },
];
