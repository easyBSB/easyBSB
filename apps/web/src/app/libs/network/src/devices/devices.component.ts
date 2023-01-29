import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ListItem } from '@easy-bsb/web/core/datasource';
import { filter, Observable } from 'rxjs';
import { Bus, Device } from '../api';
import { NetworkViewHelper, ViewState } from '../utils/network-view.helper';
import { DevicesListDatasource } from '../utils/device.datasource';

@Component({
  selector: 'easy-bsb-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {

  public columns: (keyof Omit<Device, 'id'> | 'actions')[] = ['name', 'address', 'vendor', 'vendor_device', 'actions'];
  public listData$: Observable<ListItem<Device>[]>;
  public bus?: Bus;

  private currentEditItem?: ListItem<Device>;

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
    if (this.bus) {
      this.currentEditItem = this.datasource.create<[Bus['id']]>(this.bus.id);
    }
  }

  remove(item: ListItem<Device>) {
    this.datasource.remove(item);
  }

  edit(item: ListItem<Device>) {
    this.currentEditItem = item;
    this.datasource.edit(item);
  }

  write(item: ListItem<Device>) {
    this.currentEditItem = void 0;
    this.datasource.write(item);
  }

  cancelEdit(item: ListItem<Device>) {
    this.currentEditItem = void 0;
    this.datasource.cancelEdit(item);
  }
  
  closePanel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    if (this.currentEditItem) {
      // @todo show warning
      this.cancelEdit(this.currentEditItem);
    }
    this.viewHelper.setViewState(ViewState.BUS);
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
        // @todo unsubscribe on destroy
        filter((context) => context.state === ViewState.DEVICE),        // we are on devices
      )
      .subscribe(({ bus }) => {
        if (!bus) {
          this.viewHelper.setViewState(ViewState.BUS);
          return;
        }

        this.bus = bus
        this.datasource.load(bus.id); 
        this.cdRef.markForCheck();
      });
  }
}
