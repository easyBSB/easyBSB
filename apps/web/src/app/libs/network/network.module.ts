import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { MessageModule } from '@app/libs/message';
import { PipesModule } from '@app/core/pipes';

import { BusComponent } from './bus/bus.component';
import { BusListDatasource } from './bus/bus.datasource';
import { DevicesListDatasource } from './devices/devices.datasource';
import { DevicesComponent } from './devices/devices.component';

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
    PipesModule
  ],
  exports: [
    BusComponent
  ],
  providers: [
    BusListDatasource,
    DevicesListDatasource
  ],
})
export class NetworkModule {}
