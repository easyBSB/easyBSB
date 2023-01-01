import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListDatasource } from '@app/core/datasource';
import { MessageService } from '@app/core/message';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Bus } from '../api';
import { NetworkStore } from './network-store';

@Injectable()
export class BusListDatasource extends ListDatasource<Bus> {

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly messageService: MessageService,
    private readonly networkStore: NetworkStore
  ) {
    super();
  }

  protected fetch(): Observable<Bus[]> {
    const busList = this.networkStore.getBusList();
    if (busList) {
      return of(busList);
    }

    return this.httpClient.get<Bus[]>("/api/bus").pipe(
      tap((items) => {
        for (const item of items) {
          this.networkStore.addBus(item);
        }
      })
    )
  }

  protected createPhantom(): Bus {
    return {
      address: 0x43,
      id: Math.random().toString(32),
      name: 'BSB',
      port: 1046,
      ip_serial: '0.0.0.0',
      type: 'tcpip'
    }
  }

  protected writeEntity(entity: Bus, options: Record<string, unknown>): Observable<Bus> {
    const {id, ...payload} = entity;
    return this.httpClient.put<Bus>("/api/bus", payload , options)
      .pipe(
        tap((bus) => this.networkStore.addBus(bus)),
      );
  }

  protected removeEntity(entity: Bus): Observable<unknown> {
    const { id } = entity;
    return this.httpClient.delete("/api/bus/" + id).pipe(
      tap(() => this.networkStore.removeBus(entity))
    )
  }

  protected updateEntity(entity: Bus, options: Record<string, unknown>): Observable<Bus> {
    const {id, ...payload} = entity;
    return this.httpClient
      .post<Bus>("/api/bus/" + id, payload, options)
      .pipe(
        tap((bus) => this.networkStore.updateBus(bus)),
        tap(() => this.messageService.success(`Bus ${entity.name} saved.`))
      );
  }

  /**
   * simple validator to check combination of type_address_?port
   */
  protected validate(entity: Bus): boolean {
    let isValid = true;
    let error: string | null = null;

    if (entity.name.trim() === '') {
      error = `Name darf nicht leer sein`;
    }

    const entityUniqueKey = this.createUniqueKey(entity);
    const isDuplicate = this.storage.some((item) => {
      if (item.raw === entity) {
        return false;
      }
      return entityUniqueKey === this.createUniqueKey(item.raw)
    });

    if (isDuplicate) {
      error = `IP/Serial(:Port) bereits belegt.`
    }

    if (error !== null) {
      this.messageService.error(error);
      isValid = false;
    }
    return isValid;
  }

  private createUniqueKey(entity: Bus): string {
    return [
      entity.type,
      entity.ip_serial,
      entity.port.toString() ?? ''
    ]
      .filter((val) => val.trim() !== '')
      .join('_');
  }
}
