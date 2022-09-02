import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ListItem } from '@app/core';
import { Observable } from 'rxjs';
import { Bus } from '../api';
import { DevicesListDatasource } from './devices.datasource';

@Component({
  selector: 'easy-bsb-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {

  @Output()
  close: EventEmitter<void> = new EventEmitter();

  deviceList$: Observable<ListItem<Bus>[]>;

  columns = ['name', 'address', 'type', 'port', 'actions'];

  constructor(
    private readonly datasource: DevicesListDatasource,
    // private readonly cdRef: ChangeDetectorRef
  ) {
    this.deviceList$ = this.datasource.connect();
  }

  ngOnInit(): void {
    console.log('not empty');
  }

  trackById(_index: number, bus: ListItem<Bus>) {
    return bus.raw.id;
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
  
  closeView() {
    this.close.emit()
  }
}
