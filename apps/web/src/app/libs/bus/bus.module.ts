import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { MatIconModule } from '@angular/material/icon';
import { MessageModule } from '../message/message.module';
import { BusComponent } from './bus.component';

@NgModule({
  declarations: [
    BusComponent
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
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [],
  providers: [],
})
export class BusModule {}
