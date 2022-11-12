import { CdkAccordionItem } from '@angular/cdk/accordion';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { animationFrameScheduler, delay, of, ReplaySubject, Subject, switchMap, take, takeUntil } from 'rxjs';
import { I18NService } from '@app/libs/i18n';
// @todo replace this ugly import
import { Category } from '../../../../../../../libs/easybsb-parser/src/lib/interfaces';
import { DeviceDataService } from '../utils/bsb.service';

@Component({
  selector: 'easybsb-device-data',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit, OnDestroy {

  public categorys$: ReplaySubject<Record<string, Category>> = new ReplaySubject(1);

  private destroy$ = new Subject<void>();

  constructor(
    private readonly deviceDataService: DeviceDataService,
    private readonly i81nService: I18NService,
    private elRef: ElementRef<HTMLElement>,
  ) {}

  public ngOnInit(): void {
    this.i81nService.getLanguage()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((lang) => this.deviceDataService.getDeviceConfiguration(lang)),
      )
      // since we switch to getDeviceConfiguration observe gets completed
      // so we need to pass data by our self
      .subscribe((data) => this.categorys$.next(data));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
