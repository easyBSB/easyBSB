import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Actions, Subjects } from '../api';
import { PermissionService } from '../utils/permission.service';

export declare type AbilityResolver = (snapshot: ActivatedRouteSnapshot) => [Actions, Subjects];
export const ABILITY_RESOLVER = new InjectionToken<AbilityResolver>(`ability resolver`);

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    @Inject(ABILITY_RESOLVER) @Optional() private readonly abilityResolver: AbilityResolver,
    private readonly permissionService: PermissionService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const [action, subject] = this.abilityResolver?.(route) ?? route.data['ability'] ?? [];

    if (!action || !subject) {
      return true;
    }

    return this.permissionService.hasPermission(action, subject);
  }
}
