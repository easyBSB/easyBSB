import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivateChild {

  public constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly router: Router,
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.authorizationService.isAuthorized().pipe(
      tap((isAuthorized) => {
        !isAuthorized ? this.router.navigate(['login']) : void 0
      })
    );
  }
}
