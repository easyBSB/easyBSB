import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListDatasource } from '@app/core';
import { EMPTY, Observable } from 'rxjs';
import { Device } from '../api';

function* deviceGenerator(): Generator<Device> {
  const id = Math.random().toString(32);
  let address = 0x00;

  while (true) {
    const device: Device = {
      address,
      bus_id: 1,
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

  private deviceGenerator = deviceGenerator();

  public constructor(
    private readonly httpClient: HttpClient,
  ) {
    super();
  }

  protected fetch(): Observable<Device[]> {
    console.log('devices');
    return this.httpClient.get<Device[]>("/api/devices");
  }

  protected createPhantom(): Device {
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
    console.log('update');
    return EMPTY;
  }

  protected validate(): boolean {
    return false;
  }
}
