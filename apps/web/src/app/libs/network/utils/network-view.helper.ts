import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bus, Device } from '../api';
import { NetworkStore } from './network.store';

export enum ViewState {
  BUS,
  DEVICE
}

export interface ViewContext {
  state: ViewState;
  bus?: Bus;
  devices?: Device[];
}

@Injectable()
export class NetworkViewHelper {

  private viewState$ = new BehaviorSubject<ViewContext>({
    state: ViewState.BUS
  });

  private selectedBus!: Bus;

  constructor(
    @Inject(NetworkStore) private store: NetworkStore
  ) {}

  setViewState(state: ViewState) {
    if (state === ViewState.BUS) {
      this.viewState$.next({ state });
    }

    const bus = this.selectedBus;
    const devices = this.store.getDevices(bus);
    this.viewState$.next({ state, bus, devices });
  }

  getViewState() {
    return this.viewState$.getValue();
  }

  public selectBus(bus: Bus) {
    this.selectedBus = bus;
  }

  public viewStateChanged(): Observable<ViewContext> {
    return this.viewState$;
  }
}
