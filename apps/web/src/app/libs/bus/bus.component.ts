import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, skip, takeUntil } from 'rxjs';
import { BusListItem } from './api';
import { BusListDatasource } from './bus.datasource';

@Component({
  selector: 'easy-bsb-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit, OnDestroy {

  columns = ['name', 'address', 'type', 'port', 'actions'];
  busData$: Observable<BusListItem[]>;
  busTypeOtions: ['tcpip' | 'serial' , 'TCP/IP' | 'Serial'][] = [
    ['tcpip', 'TCP/IP'],
    ['serial', 'Serial']
  ];

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
  trackById(_index: number, user: BusListItem) {
    return user.raw.id;
  }

  addBus() {
    this.datasource.create();
  }

  remove(item: BusListItem) {
    this.datasource.remove(item);
  }

  edit(item: BusListItem) {
    this.datasource.edit(item);
  }

  write(item: BusListItem) {
    this.datasource.write(item);
  }

  cancelEdit(item: BusListItem) {
    this.datasource.cancelEdit(item);
  }
}
