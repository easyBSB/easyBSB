import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PermissionsModule } from '@app/core/permissions';
import { I18NModule } from '@app/core/i18n';
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
