import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListDatasource } from '@app/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { Bus, Device } from '../api';
import { NetworkStore } from './network-store';

@Injectable()
export class DevicesListDatasource extends ListDatasource<Device> {

  public constructor(
    private readonly httpClient: HttpClient,
    @Inject(NetworkStore) private readonly networkStore: NetworkStore
  ) {
    super();
  }

  protected fetch(id: Bus['id']): Observable<Device[]> {
    const bus = this.networkStore.getBus(id);
    const devices = bus ? this.networkStore.getDevices(bus) : void 0;

    if (!bus) {
      return throwError(() => new Error('could not find bus'));
    }

    if (devices) {
      return of(devices);
    }

    return this.httpClient.get<Device[]>(`/api/bus/${id}/devices`)
      .pipe(
        tap((devices) => this.networkStore.setDevices(bus, devices))
      );
  }

  protected createPhantom(id: Bus['id']): Device {
    const deviceId = Math.random().toString(32);
    const device: Device = {
      address: 0x00,
      bus_id: id,
      id: deviceId,
      vendor: 0,
      vendor_device: 0
    }
    return device;
  }

  protected removeEntity(entity: Device): Observable<void> {
    const { id } = entity;
    return this.httpClient.delete<void>('/api/device/' + id).pipe(
      tap(() => this.networkStore.removeDevice(entity))
    );
  }

  protected updateEntity(entity: Device, options: Record<string, unknown>): Observable<Device> {
    const { id, ...payload } = entity;
    return this.httpClient.post<Device>('/api/device/' + id, payload, options).pipe(
      tap((response) => this.networkStore.updateDevice(response))
    );
  }

  protected writeEntity(entity: Device, options: Record<string, unknown>): Observable<Device> {
    const {id, ...payload} = entity;
    return this.httpClient.put<Device>(`/api/device`, payload, options)
      .pipe(
        tap((device) => this.networkStore.addDevice(device))
      )
  }

  protected validate(): boolean {
    /**
     * @todo validate correctly
     */
    return true;
  }
}
