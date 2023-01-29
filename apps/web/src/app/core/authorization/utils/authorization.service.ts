import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap } from "rxjs";
import { PermissionService } from "@easy-bsb/web/core/permissions";
import { User } from "@easy-bsb/web/api/users";

import { LoginDto, LoginResponseDto } from "../api/login.dto";
import { STORAGE_KEY_JWT } from "../constants";


interface AuthorizationState {
  loggedIn: boolean;
  user: User | undefined;
  expires: number;
}

@Injectable({
  providedIn: "root",
})
export class AuthorizationService {

  /**
   * @description initial session state
   */
  private sessionState: AuthorizationState = {
    loggedIn: false,
    user: undefined,
    expires: 0
  };

  private readonly authorizationState$ = new BehaviorSubject<AuthorizationState>(this.sessionState);

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly permissionService: PermissionService
  ) { }

  /**
   * @description send head request to check we are logged in
   */
  isAuthorized(): Observable<boolean> {

    if (!sessionStorage.getItem(STORAGE_KEY_JWT)) {
      this.clearSessionState();
      return of(false);
    }

    if (this.sessionState.expires > new Date().getTime()) {
      return of(true);
    }

    return this.httpClient.head("/api/auth/authorized").pipe(
      take(1),
      map(() => {
        this.refreshSessionState();
        return true;
      }),
      catchError(() => {
        this.clearSessionState();
        return of(false)
      })
    );
  }

  /**
   * @description initializes session state
   */
  loadSessionState(): Observable<void> {
    return this.isAuthorized()
      .pipe(
        tap((authorized) => {
          if (!authorized) {
            throw 'not authorized error';
          }
        }),
        switchMap(() => this.httpClient.get<User>('/api/auth/user')),
        tap((user) => this.writeSessionState(user)),
        catchError(() => {
          this.clearSessionState();
          return of({ loggedIn: false, user: undefined, expires: 0 });
        }),
        map(() => void 0)
      )
  }

  stateChange(): Observable<AuthorizationState> {
    return this.authorizationState$.asObservable();
  }

  login(payload: LoginDto): Observable<LoginResponseDto> {
    return this.httpClient
      .post<LoginResponseDto>("/api/auth/login", payload)
      .pipe(
        tap((response) => {
          const {jwt, user} = response;
          sessionStorage.setItem(STORAGE_KEY_JWT, jwt);
          this.writeSessionState(user);
        })
      );
  }

  logout(): void {
    this.clearSessionState();
    this.authorizationState$.next(this.sessionState);
    this.router.navigate(['/login']);
  }

  authorizedUser(): User | undefined {
    return this.authorizationState$.value.user;
  }

  /**
   * @description write current sesstion state and notify observers
   */
  private writeSessionState(user: User): void {
    this.sessionState = {
      loggedIn: true,
      user,
      expires: new Date().getTime() + 60 * 5 * 1000 // +5 minutes
    };
    this.permissionService.defineAbilities(user);
    this.authorizationState$.next(this.sessionState);
  }

  private refreshSessionState(): void {
    this.sessionState = { 
      ...this.sessionState, 
      expires: new Date().getTime() + 60 * 5 * 1000 // +5 minutes
    }
  }

  /**
   * @description clear session state and notify observers
   */
  private clearSessionState(): void {
    sessionStorage.removeItem(STORAGE_KEY_JWT);
    this.sessionState = { loggedIn: false, user: undefined, expires: 0 };
  }
}
