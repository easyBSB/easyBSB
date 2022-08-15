import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap } from "rxjs";
import { User } from "../../users/api";
import { LoginDto, LoginResponseDto } from "../api/login.dto";
import { STORAGE_KEY_JWT, STORAGE_KEY_USER } from "../constants";

interface AuthorizationState {
  loggedIn: boolean;
  user: User | undefined;
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
    user: undefined
  };

  private readonly authorizationState$ = new BehaviorSubject<AuthorizationState>(this.sessionState);

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
  ) { }

  /**
   * @description send head request to check we are logged in
   */
  isAuthorized(): Observable<boolean> {
    return this.httpClient.head("/api/auth/authorized").pipe(
      take(1),
      map(() => true),
      catchError(() => {
        this.clearSessionState();
        return of(false)
      })
    );
  }

  loadSessionState(): Observable<AuthorizationState> {
    return this.isAuthorized()
      .pipe(
        tap((authorized) => {
          if (!authorized) {
            throw 'not authorized error';
          }
        }),
        switchMap(() => this.httpClient.get<User>('/api/auth/user')),
        map<User, AuthorizationState>((user: User) => ({loggedIn: true, user })),
        catchError(() => {
          this.clearSessionState();
          return of({ loggedIn: false, user: undefined });
        }),
        tap((state) => this.authorizationState$.next(state))
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
          this.writeSessionState(jwt, user);
          this.authorizationState$.next(this.sessionState);
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
  private writeSessionState(jwt: string, user: User): void {
    sessionStorage.setItem(STORAGE_KEY_JWT, jwt);
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user ?? ""));
    this.sessionState = { loggedIn: true, user };
  }

  /**
   * @description clear session state and notify observers
   */
  private clearSessionState(): void {
    sessionStorage.removeItem(STORAGE_KEY_JWT);
    sessionStorage.removeItem(STORAGE_KEY_USER);
    this.sessionState = { loggedIn: false, user: undefined };
  }
}
