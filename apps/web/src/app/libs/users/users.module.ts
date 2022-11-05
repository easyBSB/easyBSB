import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { UsersComponent } from './users.component';
import { MatIconModule } from '@angular/material/icon';
import { MessageModule } from '../message/message.module';
import { I18NModule } from '../i18n/src/i18n.module';

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
  exports: [UsersComponent],
  providers: [],
})
export class UsersModule {}
