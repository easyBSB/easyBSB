import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListDatasource } from '@app/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { Bus, Device } from '../api';

function* deviceGenerator(busId: Bus['id']): Generator<Device> {
  const id = Math.random().toString(32);
  let address = 0x00;

  while (true) {
    const device: Device = {
      address,
      bus_id: busId,
      id,
      vendor: void 0,
      vendor_device: void 0
    }

    address += 1;
    yield device;
  }
}

@Injectable()
export class DevicesListDatasource extends ListDatasource<Device> {

  private selectedBus?: Bus;
  private deviceGenerator?: Generator<Device>;

  public constructor(
    private readonly httpClient: HttpClient,
  ) {
    super();
  }

  public set bus(bus: Bus | undefined) {
    this.selectedBus = bus;
    if (bus) {
      this.deviceGenerator = deviceGenerator(bus.id);
    }
  }

  public get bus(): Bus | undefined {
    return this.selectedBus;
  }

  protected fetch(): Observable<Device[]> {
    if (!this.bus) {
      return throwError(() => new Error(`No bus selected`));
    }
    return this.httpClient.get<Device[]>(`/api/bus/${this.bus.id}/devices`);
  }

  protected createPhantom(): Device {
    if (!this.bus || !this.deviceGenerator) {
      throw `No Bus selected`;
    }
    return this.deviceGenerator.next().value;
  }

  protected writeEntity(): Observable<Device> {
    console.log('write');
    return EMPTY;
  }

  protected removeEntity(): Observable<unknown> {
    console.log('remove');
    return EMPTY;
  }

  protected updateEntity(): Observable<Device> {
    return EMPTY;
  }

  protected validate(): boolean {
    return false;
  }
}
