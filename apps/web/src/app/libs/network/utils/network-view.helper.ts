import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay } from 'rxjs';
import { Bus } from '../api';

export enum ViewState {
  BUS,
  DEVICE
}

@Injectable()
export class NetworkViewHelper {

  public busSelectionModel: SelectionModel<Bus>;
  private selectionChange$: Observable<SelectionChange<Bus>>;
  private viewState$ = new BehaviorSubject<ViewState>(ViewState.BUS);

  constructor() {
    this.busSelectionModel = new SelectionModel(false);
    this.selectionChange$ = this.busSelectionModel.changed.pipe(shareReplay());
  }

  set viewState(state: ViewState) {
    this.viewState$.next(state);
  }

  get viewState() {
    return this.viewState$.getValue();
  }

  get busChanged(): Observable<SelectionChange<Bus>> {
    return this.selectionChange$;
  }

  get selectedBus(): Bus | undefined {
    if (this.busSelectionModel.selected.length > 0) {
      return this.busSelectionModel.selected[0];
    }
    return void 0;
  }

  public selectBus(bus: Bus) {
    this.busSelectionModel.select(bus);
  }

  public viewStateChanged(): Observable<ViewState> {
    return this.viewState$
      .pipe(distinctUntilChanged());
  }
}
