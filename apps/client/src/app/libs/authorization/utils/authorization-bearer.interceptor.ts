import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { STORAGE_KEY_JWT } from "../constants";

@Injectable({
  providedIn: "root",
})
export class AuthorizationBearerInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const bearerToken = sessionStorage.getItem(STORAGE_KEY_JWT);
    if (bearerToken) {
      const authorizationHeaders: Record<string, string> = {
        Authorization: "Bearer " + bearerToken,
      };
      req = req.clone({
        setHeaders: authorizationHeaders,
      });
    }
    return next.handle(req);
  }
}
