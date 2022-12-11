import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

import { PipesModule } from '@app/core/pipes';
import { I18NModule } from '@app/libs/i18n';
import { MessageModule } from '@app/libs/message';

import { BusComponent } from './bus/bus.component';
import { BusListDatasource } from './utils/bus.datasource';
import { DevicesListDatasource } from './utils/device.datasource';
import { DevicesComponent } from './devices/devices.component';
import { NetworkViewHelper } from './utils/network-view.helper';
import { NetworkStore, NetworkMemoryStore } from './utils/network-store';

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
    I18NModule
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
