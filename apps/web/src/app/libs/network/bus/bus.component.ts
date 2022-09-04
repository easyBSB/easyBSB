import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ListItem } from '@app/core';
import { Observable, Subject, skip, takeUntil } from 'rxjs';
import { Bus } from '../api';
import { NetworkViewHelper, ViewState } from '../utils/network-view.helper';
import { BusListDatasource } from './bus.datasource';
import { deviceAnimationMetadata } from './constants';

@Component({
  selector: 'easy-bsb-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
  providers: [ NetworkViewHelper ],
  animations: [ deviceAnimationMetadata ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusComponent implements OnInit, OnDestroy {

  public columns = ['name', 'address', 'type', 'port', 'actions'];
  public busData$: Observable<ListItem<Bus>[]>;
  public busTypeOtions: ['tcpip' | 'serial' , 'TCP/IP' | 'Serial'][] = [
    ['tcpip', 'TCP/IP'],
    ['serial', 'Serial']
  ];

  public state: 'open' | 'closed' = 'closed';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly datasource: BusListDatasource,
    private readonly cdRef: ChangeDetectorRef,
    private readonly viewHelper: NetworkViewHelper,
  ) {
    this.busData$ = this.datasource.connect();
  }

  ngOnInit(): void {
    this.busData$
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe(() => this.cdRef.markForCheck());

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
    this.viewHelper.viewState = ViewState.DEVICE;
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
      .subscribe((state) => {
        // toggle device view
        this.state = state === ViewState.DEVICE ? 'open' : 'closed';
      });
  }
}
