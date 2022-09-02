import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { MatIconModule } from '@angular/material/icon';
import { MessageModule } from '../message/message.module';
import { BusComponent } from './bus/bus.component';
import { BusListDatasource } from './bus/bus.datasource';
import { NetworkComponent } from './network/network.component';
import { DevicesListDatasource } from './devices/devices.datasource';
import { DevicesComponent } from './devices/devices.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    BusComponent,
    DevicesComponent,
    NetworkComponent,
  ],
  imports: [ 
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MessageModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    NetworkComponent
  ],
  providers: [
    BusListDatasource,
    DevicesListDatasource
  ],
})
export class NetworkModule {}