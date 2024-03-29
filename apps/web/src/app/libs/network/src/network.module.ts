import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';


import { BusComponent } from './bus/bus.component';
import { BusListDatasource } from './utils/bus.datasource';
import { DevicesListDatasource } from './utils/device.datasource';
import { DevicesComponent } from './devices/devices.component';
import { NetworkViewHelper } from './utils/network-view.helper';
import { NetworkStore, NetworkMemoryStore } from './utils/network-store';
import { I18NModule } from '../../../core/i18n';
import { MessageModule } from '../../../core/message';
import { PipesModule } from '../../../core/pipes';

@NgModule({
  declarations: [
    BusComponent,
    DevicesComponent,
  ],
  imports: [ 
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MessageModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    I18NModule,
  ],
  exports: [
    BusComponent
  ],
  providers: [
    BusListDatasource,
    DevicesListDatasource,
    NetworkViewHelper,
    { provide: NetworkStore, useClass: NetworkMemoryStore }
  ],
})
export class NetworkModule {}
