import { Route } from "@angular/router";
import { SettingsComponent } from "../ui/settings.component";

export const SettingRoutes: Route[] = [
  {
    path: "",
    redirectTo: "devices",
    pathMatch: "prefix"
  },
  {
    path: ":section",
    component: SettingsComponent,
  },
];
