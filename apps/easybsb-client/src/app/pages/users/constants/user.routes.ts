import { Route } from "@angular/router";
import { UserManageComponent } from "../ui/user-manage.component";
import { UsersListComponent } from "../ui/users-list.component";

export const UserRoutes: Route[] = [{
  path: '',
  component: UsersListComponent
}, {
  // update user
  path: 'manage/:id',
  component: UserManageComponent
}, {
  // create user
  path: 'new',
  component: UserManageComponent
}]
