
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from './ui/login.component';

const routes: Route[] = [{
  path: 'login',
  component:  LoginComponent
}]

@NgModule({
  declarations: [ LoginComponent ],
  imports: [ CommonModule, RouterModule.forChild(routes)],
  exports: [ RouterModule ],
  providers: [],
})
export class AuthorizationRouterModule {}
