import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListDatasource } from '@app/core';
import { EMPTY, Observable, of } from 'rxjs';
import { Bus, Device } from '../api';
import { NetworkStore } from '../utils/network.store';

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

    if (devices) {
      return of(devices);
    }

    return this.httpClient.get<Device[]>(`/api/bus/${id}/devices`)
  }

  protected createPhantom(id: Bus['id']): Device {
    const address = 0x00;
    const deviceId = Math.random().toString(32);
    const device: Device = {
      address,
      bus_id: id,
      id: deviceId,
      vendor: void 0,
      vendor_device: void 0
    }
    return device;
  }

  protected writeEntity(entity: Device, options: Record<string, unknown>): Observable<Device> {
    const {id, ...payload} = entity;
    return this.httpClient.put<Device>(`/api/device`, payload, options);
  }

  protected removeEntity(): Observable<unknown> {
    return EMPTY;
  }

  protected updateEntity(): Observable<Device> {
    return EMPTY;
  }

  protected validate(): boolean {
    /**
     * @todo validate correctly
     */
    return true;
  }
}
