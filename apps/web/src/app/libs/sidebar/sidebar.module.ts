import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { I18NModule } from '../i18n/src/i18n.module';
import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    BrowserAnimationsModule,
    RouterModule,
    I18NModule
  ],
  exports: [SidebarComponent],
  declarations: [SidebarComponent],
})
export class SidebarModule { }

