import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { AuthorizationService } from '../utils/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivateChild {

  constructor(
    private readonly authService: AuthorizationService,
    private readonly router: Router
  ) {}

  canActivateChild(): Observable<boolean> {
    const authorized$ = this.authService.isAuthorized();
    return authorized$.pipe(
      tap((authorized) => {
        if (!authorized) {
          throw `not authorized`
        }
      }),
      catchError(() => {
        this.router.navigate(['/login'])
        return of(false);
      })
    )
  }
}
