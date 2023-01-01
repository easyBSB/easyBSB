import { NgModule } from '@angular/core';
import { PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from './api';
import { PermissionGuard } from './guards/permission';

@NgModule({
  imports: [ AbilityModule ],
  providers: [
    PermissionGuard,
    { provide: AppAbility, useValue: new PureAbility() },
  ],
  exports: [AbilityModule]
})
export class PermissionsModule {}
