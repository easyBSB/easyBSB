import { Route } from "@angular/router";
import { PermissionGuard } from "../../../core/permissions";
import { SettingsComponent } from "../ui/settings.component";

export const SettingRoutes: Route[] = [
  {
    path: "",
    redirectTo: "devices",
    pathMatch: "prefix"
  },
  {
    path: ":section",
    canActivate: [ PermissionGuard ],
    component: SettingsComponent,
  },
];
