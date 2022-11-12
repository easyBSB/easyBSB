import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DeviceDataService } from './utils/bsb.service';
import { MatIconModule } from '@angular/material/icon';
import { CategoriesComponent } from './ui/categories.component';
import { CommandsComponent } from './ui/commands.component';
import { BsbComponent } from './ui/bsb.component';
import { I18NModule } from '../i18n/src/i18n.module';

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
