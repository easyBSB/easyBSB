import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from './api';
import { PureAbility } from '@casl/ability';

@NgModule({
  imports: [ CommonModule, AbilityModule ],
  providers: [
    { provide: AppAbility, useValue: new PureAbility() },
  ],
  exports: [AbilityModule]
})
export class PermissionsModule {}
