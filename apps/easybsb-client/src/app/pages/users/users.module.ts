import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { UsersListComponent } from './ui/users-list.component';
import { UserManageComponent } from './ui/user-manage.component';
import { UserRoutingModule } from './users.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UsersListComponent,
    UserManageComponent,
  ],
  imports: [
    CdkTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
  ],
  providers: [],
})
export class UsersModule {}