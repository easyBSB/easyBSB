import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Category, Command } from "../../../../../../../libs/easybsb-parser/src/lib/interfaces";
import { Bus } from "../../network/api";

@Injectable()
export class DeviceDataService {

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getDeviceConfiguration(id: Bus['id'] = 1): Observable<Record<string, Category>> {
    // assume for now we have only 1 device with ID = 1
    return this.httpClient.get<Record<string, Category>>(`api/bsb/bus/${id}/categories`, {
      params: {
        lang: 'de'
      }
    })
  }

  public getParamValue(id: Bus['id'], param: Command['parameter']): Observable<string | number | null> {
    /** not sure we need a better endpoint for this */
    return this.httpClient
      .get<{ data: string | number | null }>(`api/bus/${id}/param/${param}`)
      .pipe(
        map((response) => response.data)
      )
  }
}