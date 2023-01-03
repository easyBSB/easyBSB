import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthorizationService } from '../utils/authorization.service';

/**
 * Login page guard, so we could not enter route 
 * until we are not authorized anymore.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginPageGuard implements CanActivate {

  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {

    return this.authorizationService.isAuthorized()
      .pipe( 
        catchError(() => of(false)), // return true so next step we negate
        map((isAuthorized) => {
          if (isAuthorized) {
            this.router.navigate(['/'])
          }
          return !isAuthorized
        })
      );
  }
}
