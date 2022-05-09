import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { APP_ENVIRONMENT } from '../../../constants/injection.tokens';
import { LoginDto, LoginResponseDto } from '../api/login.dto';
import { STORAGE_KEY_JWT } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private host: string;

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_ENVIRONMENT) private readonly environment: APP_ENVIRONMENT
  ) {
    this.host = this.environment.api.host;
  }

  /**
   * @description send head request to check we are logged in
   */
  isAuthorized(): Observable<boolean> {
    return this.httpClient.head(this.host + '/api/auth/authorized')
      .pipe(map(() => true), take(1), catchError(() => of(false)))
  }

  login(payload: LoginDto) {
    return this.httpClient.post<LoginResponseDto>(this.host + '/api/auth/login', payload)
      .pipe(
        tap((response) => sessionStorage.setItem(STORAGE_KEY_JWT, response.jwt))
      )
  }
}

