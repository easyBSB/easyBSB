import { trigger, transition, style, state, animate } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ListItem } from '@app/core';
import { Observable, Subject, skip, takeUntil } from 'rxjs';
import { Bus } from '../api';
import { BusListDatasource } from './bus.datasource';

@Component({
  selector: 'easy-bsb-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
  animations: [
    trigger('devicesContainer', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' })
      ]),

      state('open', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(100%)' })),

      transition('open => closed', [animate('100ms ease-in')]),
      transition('closed => open', [animate('200ms ease-out')])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusComponent implements OnInit, OnDestroy {

  columns = ['name', 'address', 'type', 'port', 'actions'];
  busData$: Observable<ListItem<Bus>[]>;
  busTypeOtions: ['tcpip' | 'serial' , 'TCP/IP' | 'Serial'][] = [
    ['tcpip', 'TCP/IP'],
    ['serial', 'Serial']
  ];

  state: 'open' | 'closed' = 'closed';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly datasource: BusListDatasource,
    private readonly cdRef: ChangeDetectorRef
  ) {
    this.busData$ = this.datasource.connect();
  }

  ngOnInit(): void {
    this.busData$
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe(() => this.cdRef.markForCheck());

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
    console.log(item);
    this.state = 'open';
  }

  closeDevices() {
    this.state = 'closed';
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
}
