import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, take, tap } from "rxjs";
import { LoginDto, LoginResponseDto } from "../api/login.dto";
import { STORAGE_KEY_JWT } from "../constants";

@Injectable({
  providedIn: "root",
})
export class AuthorizationService {
  constructor(private httpClient: HttpClient) {}

  /**
   * @description send head request to check we are logged in
   */
  isAuthorized(): Observable<boolean> {
    return this.httpClient.head("/api/auth/authorized").pipe(
      map(() => true),
      take(1),
      catchError(() => of(false))
    );
  }

  login(payload: LoginDto): Observable<LoginResponseDto> {
    return this.httpClient
      .post<LoginResponseDto>("/api/auth/login", payload)
      .pipe(
        tap((response) => sessionStorage.setItem(STORAGE_KEY_JWT, response.jwt))
      );
  }
}