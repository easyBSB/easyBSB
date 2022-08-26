import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface HttpRequestOptions {
  headers?: HttpHeaders | {
      [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
}
