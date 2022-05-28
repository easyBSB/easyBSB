import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRoutes } from './constants/user.routes';

@NgModule({
  imports: [
    RouterModule.forChild(UserRoutes),
  ],
  exports: [RouterModule]
})
export class UserRoutingModule {}