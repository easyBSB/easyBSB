import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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
