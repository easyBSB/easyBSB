import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListDatasource } from '@app/core';
import { MessageService } from '@app/libs/message';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Bus } from '../api';

@Injectable()
export class DevicesListDatasource extends ListDatasource<Bus> {

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly messageService: MessageService
  ) {
    super();
  }

  protected fetch(): Observable<Bus[]> {
    return this.httpClient.get<Bus[]>("/api/bus");
  }

  protected createPhantom(): Bus {
    return {
      address: -1,
      id: Math.random().toString(32),
      name: 'Phantom Bus',
      port: 1234,
      type: 'tcpip'
    }
  }

  protected writeEntity(entity: Bus, options: Record<string, unknown>): Observable<Bus> {
    const {id, ...payload} = entity;
    return this.httpClient.put<Bus>("/api/bus", payload , options);
  }

  protected removeEntity(entity: Bus): Observable<unknown> {
    const { id } = entity;
    return this.httpClient.delete("/api/bus/" + id);
  }

  protected updateEntity(entity: Bus, options: Record<string, unknown>): Observable<Bus> {
    const {id, ...payload} = entity;
    return this.httpClient
      .post<Bus>("/api/bus/" + id, payload, options)
      .pipe(
        tap(() => this.messageService.success(`User ${entity.name} saved`))
      );
  }

  protected validate(): boolean {
    return true;
  }
}
