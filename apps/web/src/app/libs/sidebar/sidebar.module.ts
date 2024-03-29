import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { I18NModule } from '../../core/i18n';
import { PermissionsModule } from '../../core/permissions';
import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    BrowserAnimationsModule,
    RouterModule,
    I18NModule,
    PermissionsModule,
  ],
  exports: [SidebarComponent],
  declarations: [SidebarComponent],
})
export class SidebarModule { }
