import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { UsersComponent } from './users.component';
import { I18NModule } from '../../../core/i18n';
import { MessageModule } from '../../../core/message';
import { PermissionsModule } from '../../../core/permissions';

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [ 
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    I18NModule,
    PermissionsModule
  ],
  exports: [UsersComponent],
  providers: [],
})
export class UsersModule {}
