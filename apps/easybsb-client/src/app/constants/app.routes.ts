import { Route } from "@angular/router";
import { AuthorizationGuard } from "../libs/authorization";

export const AppRoutes: Route[] = [
  {
    path: "",
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("../pages/dashboard/dashboard.module").then(
            (module) => module.DashboardModule
          ),
      },
      {
        path: "users",
        loadChildren: () =>
          import("../pages/users/users.module").then(
            (module) => module.UsersModule
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
