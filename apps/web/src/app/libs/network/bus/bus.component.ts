import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ListItem } from '@app/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Bus } from '../api';
import { NetworkViewHelper, ViewState } from '../utils/network-view.helper';
import { BusListDatasource } from '../utils/bus.datasource';
import { deviceAnimationMetadata } from './constants';

@Component({
  selector: 'easy-bsb-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
  providers: [
  ],
  animations: [ deviceAnimationMetadata ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusComponent implements OnInit, OnDestroy {

  public columns = ['name', 'address', 'type', 'ip_serial',  'port', 'actions'];
  public busData$: Observable<ListItem<Bus>[]>;
  public busTypeOtions: ['tcpip' | 'serial' , 'TCP/IP' | 'Serial'][] = [
    ['tcpip', 'TCP/IP'],
    ['serial', 'Serial']
  ];

  public state: 'open' | 'closed' = 'closed';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly datasource: BusListDatasource,
    private readonly viewHelper: NetworkViewHelper,
  ) {
    this.busData$ = this.connectDatasource();
  }

  ngOnInit(): void {
    this.handleViewstateChange();
    this.datasource.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @description performance booster for mat-table
   */
  trackById(_index: number, bus: ListItem<Bus>) {
    return bus.raw.id;
  }

  showDevices(item: ListItem<Bus>) {
    this.viewHelper.selectBus(item.raw);
    this.viewHelper.setViewState(ViewState.DEVICE);
  }

  addBus() {
    this.datasource.create();
  }

  remove(item: ListItem<Bus>) {
    this.datasource.remove(item);
  }

  edit(item: ListItem<Bus>) {
    this.datasource.edit(item);
  }

  write(item: ListItem<Bus>) {
    this.datasource.write(item);
  }

  cancelEdit(item: ListItem<Bus>) {
    this.datasource.cancelEdit(item);
  }

  /**
   * @description handle view state changes
   */
  private handleViewstateChange(): void {
    this.viewHelper.viewStateChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ state }) => {
        this.state = state === ViewState.DEVICE ? 'open' : 'closed';
      });
  }

  /**
   * @description connect to datasource, if something changed items are
   * added or removed and they are not inside cache
   */
  private connectDatasource(): Observable<ListItem<Bus>[]> {
    return this.datasource.connect();
  }
}
