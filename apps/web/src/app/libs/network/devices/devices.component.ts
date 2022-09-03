import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ListItem } from '@app/core';
import { Observable } from 'rxjs';
import { Device } from '../api';
import { DevicesListDatasource } from './devices.datasource';

@Component({
  selector: 'easy-bsb-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {

  @Output()
  closeView: EventEmitter<void> = new EventEmitter();

  deviceList$: Observable<ListItem<Device>[]>;

  columns = ['address', 'vendor', 'vendor_device', 'actions'];

  constructor(
    private readonly datasource: DevicesListDatasource,
    // private readonly cdRef: ChangeDetectorRef
  ) {
    this.deviceList$ = this.datasource.connect();
  }

  ngOnInit(): void {
    console.log('not empty');
  }

  trackById(_index: number, device: ListItem<Device>) {
    return device.raw.id;
  }

  addDevice() {
    this.datasource.create();
  }

  remove(item: ListItem<Device>) {
    this.datasource.remove(item);
  }

  edit(item: ListItem<Device>) {
    this.datasource.edit(item);
  }

  write(item: ListItem<Device>) {
    this.datasource.write(item);
  }

  cancelEdit(item: ListItem<Device>) {
    this.datasource.cancelEdit(item);
  }
  
  closePanel() {
    this.closeView.emit()
  }
}
