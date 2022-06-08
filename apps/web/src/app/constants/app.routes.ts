import { Route } from "@angular/router";

export const AppRoutes: Route[] = [
  {
    path: "",
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
