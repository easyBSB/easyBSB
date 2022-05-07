import { Route } from "@angular/router";
import { AuthorizationGuard } from "../libs/authorization";

export const AppRoutes: Route[] = [{
  path: '',
  canActivateChild: [AuthorizationGuard],
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('../pages/dashboard/dashboard.module').then((module) => module.DashboardModule)
    }, 
    {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full'
    }
  ]
}]
