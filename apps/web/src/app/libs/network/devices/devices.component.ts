import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ListItem } from '@app/core';
import { filter, Observable } from 'rxjs';
import { Bus, Device } from '../api';
import { NetworkViewHelper, ViewState } from '../utils/network-view.helper';
import { DevicesListDatasource } from './devices.datasource';

@Component({
  selector: 'easy-bsb-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {

  public columns = ['address', 'vendor', 'vendor_device', 'actions'];
  public listData$: Observable<ListItem<Device>[]>;
  public bus?: Bus;

  constructor(
    private readonly datasource: DevicesListDatasource,
    private readonly viewHelper: NetworkViewHelper, 
    private readonly cdRef: ChangeDetectorRef
  ) {
    this.listData$ = this.datasource.connect();
  }

  ngOnInit(): void {
    this.handleViewstateChange();
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
    // this closes the view state and goes back to bus
    this.viewHelper.viewState = ViewState.BUS;
  }

  /**
   * @description if viewstate has been changed we have to handle it
   * so we listen to viewstate has been set to device and we have an bus
   * selected. In this case we need to load the data
   * @todo load data from cache if we open same bus twice
   */
  private handleViewstateChange(): void {
    this.viewHelper.viewStateChanged()
      .pipe(
        // @todo unsubscribe
        filter((state) => state === ViewState.DEVICE),        // we are on devices
        filter(() => this.viewHelper.selectedBus !== void 0), // we have an selected bus
      )
      .subscribe(() => {
        // set new bus to datasource
        this.datasource.bus = this.viewHelper.selectedBus as Bus;
        this.datasource.load(); 
        this.cdRef.markForCheck();
      });
  }
}
