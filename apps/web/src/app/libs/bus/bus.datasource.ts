import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestContextToken } from '../../constants/api';
import { ListDatasource } from '@app/core';
import { RequestContext } from '../error-handler/error.interceptor';
import { Bus } from './api';

@Injectable()
export class BusListDatasource extends ListDatasource<Bus> {

  constructor(
    private readonly httpClient: HttpClient
  ) {
    super()
  }

  protected createItem(): Bus {
    throw new Error('Method not implemented.');
  }

  protected fetchItems(): Observable<Bus[]> {
    throw new Error('Method not implemented.');
  }

  protected removeItem(item: Bus): Observable<unknown> {
    const { id } = item;
    return this.httpClient.delete("/api/users/" + id);
  }

  protected updateItem(item: Bus, reqContext: RequestContext<unknown>): Observable<Bus> {
    const {id, ...payload} = item;
    const context = new HttpContext();
    context.set(RequestContextToken, reqContext);
    return this.httpClient.post<Bus>("/api/users/" + id, payload, { context });
  }

  protected validate(): boolean {
    return true;
  }

  protected writeItem(item: Bus, reqContext: RequestContext<unknown>): Observable<Bus> {
    const {id, ...payload} = item;
    const context = new HttpContext();
    context.set(RequestContextToken, reqContext);
    return this.httpClient.put<Bus>("/api/bus", payload , { context });
  }
}
