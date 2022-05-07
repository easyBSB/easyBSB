import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private httpClient: HttpClient) {}

  /**
   * @description simple check we are authorized, this is the case
   * if we have a token and he is not expired
   */
  isAuthorized(): Observable<boolean> {
    return this.httpClient.head('http://localhost:3333/api/auth/authorized')
      .pipe(map(() => true), take(1), catchError(() => of(false)))
  }
}
