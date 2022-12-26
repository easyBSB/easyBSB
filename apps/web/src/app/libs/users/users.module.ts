import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { I18NModule } from '@app/libs/i18n';
import { MessageModule } from '@app/libs/message';

import { UsersComponent } from './users.component';

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
    I18NModule
  ],
  exports: [UsersComponent, I18NModule],
  providers: [],
})
export class UsersModule {}
