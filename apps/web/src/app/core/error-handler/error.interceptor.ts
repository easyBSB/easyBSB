import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { RequestContextToken } from '../../constants/api';
import { MessageService } from '../message';

/**
 * @description HttpContext but generic, HttpContextToken got a type and we have 
 * to define the default value for this.
 */
export class RequestContext<T = unknown> {
  constructor(private value: T) {}

  set(value: T) {
    this.value = value;
  }

  get(): T {
    return this.value;
  }
}

/**
 * @description own execption to add context to http ErrorResponse
 */
export class EasyBSBHttpErrorResponse {
  constructor(
    public readonly httpContext: RequestContext,
    public readonly httpError: HttpErrorResponse
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private readonly messageService: MessageService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const context = req.context.get(RequestContextToken);
    const request = next.handle(req);

    return request.pipe(
      catchError((response: HttpErrorResponse) => {
        this.messageService.error(response.error.message);
        if (context) {
          throw new EasyBSBHttpErrorResponse(context, response);
        }
        throw response;
      })
    );
  }
}
