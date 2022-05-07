import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationBearerInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const bearerToken = sessionStorage.getItem('Authorization');
    if (bearerToken) {
      const authorizationHeaders: Record<string, string> = {
        Authorization: 'Bearer ' + bearerToken
      }
      req = req.clone({
        setHeaders: authorizationHeaders
      })
    }
    return next.handle(req);
  }
}
