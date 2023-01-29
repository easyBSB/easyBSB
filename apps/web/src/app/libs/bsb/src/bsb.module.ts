import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatIconModule } from '@angular/material/icon';
import { I18NModule } from '@easy-bsb/web/core/i18n';

import { CategoriesComponent } from './ui/categories.component';
import { CommandsComponent } from './ui/commands.component';
import { BsbComponent } from './ui/bsb.component';

import { DeviceDataService } from './utils/bsb.service';

@NgModule({
  declarations: [
    BsbComponent,
    CategoriesComponent,
    CommandsComponent
  ],
  imports: [
    CommonModule,
    CdkAccordionModule,
    MatIconModule,
    I18NModule
  ],
  exports: [
    BsbComponent
  ],
  providers: [
    DeviceDataService
  ],
})
export class BsbModule {}
