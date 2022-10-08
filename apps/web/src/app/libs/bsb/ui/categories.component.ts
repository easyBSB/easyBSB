import { CdkAccordionItem } from '@angular/cdk/accordion';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { animationFrameScheduler, delay, of, ReplaySubject, take } from 'rxjs';
import { Category } from '../../../../../../../libs/easybsb-parser/src/lib/interfaces';
import { DeviceDataService } from '../utils/bsb.service';

@Component({
  selector: 'easybsb-device-data',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit {

  public categorys$: ReplaySubject<Record<string, Category>> = new ReplaySubject(1);

  constructor(
    private readonly deviceDataService: DeviceDataService,
    private elRef: ElementRef<HTMLElement>
  ) {}

  public ngOnInit(): void {
    this.deviceDataService.getDeviceConfiguration()
      .pipe(take(1)).subscribe((data) => this.categorys$.next(data))
  }

  public handleItemOpened(item: CdkAccordionItem) {
    of(void 0)
      .pipe(delay(0, animationFrameScheduler), take(1))
      .subscribe(() => this.scrollToPosition(item));
  }

  public noSort(): number {
    return 0;
  }

  /**
   * @description scroll to specific position but only if the position of the element
   * will be smaller then our current scroll position. In other words invisible in top
   * region of the container
   */
  private scrollToPosition(item: CdkAccordionItem): void {
    const el = this.elRef.nativeElement.querySelector('#' + item.id);
    if (el) {
      const position = (el as HTMLElement).offsetTop;
      if (position >= this.elRef.nativeElement.scrollTop) {
        return;
      }

      this.elRef.nativeElement.scrollTo({
        behavior: 'smooth',
        top: position,
        left: 0
      });
    }
  }
}
