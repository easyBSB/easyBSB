import { CdkAccordionItem } from '@angular/cdk/accordion';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { animationFrameScheduler, delay, of, ReplaySubject, Subject, switchMap, take, takeUntil, throttleTime } from 'rxjs';
import { I18NService } from '@easy-bsb/web/core/i18n';
import { DeviceDataService } from '../utils/bsb.service';
import type { Category } from '@easy-bsb/parser';
import { ParameterTaskStore } from '../utils/parameter-task.store';

@Component({
  selector: 'easybsb-device-data',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [ParameterTaskStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit, OnDestroy {

  public categorys$: ReplaySubject<Record<string, Category>> = new ReplaySubject(1);

  private destroy$ = new Subject<void>();

  private clearStore$ = new Subject<void>()

  constructor(
    private readonly deviceDataService: DeviceDataService,
    private readonly i81nService: I18NService,
    private elRef: ElementRef<HTMLElement>,
    private readonly store: ParameterTaskStore
  ) {}

  public ngOnInit(): void {

    /**
     * clear store if we open a new accordion item or close it,
     * if we simple select an other one it will send 2 times.
     * 
     * First time if we open and after that the old one gets closed,
     * to handle this use throttleTime to ignore the second call.
     */
    this.clearStore$.pipe(
      takeUntil(this.destroy$),
      throttleTime(0, animationFrameScheduler)
    ).subscribe(() => this.store.clear())

    this.i81nService.getLanguage()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((lang) => this.deviceDataService.getDeviceConfiguration(lang)),
      )
      .subscribe((data) => this.categorys$.next(data));
  }

  public ngOnDestroy(): void {
    this.store.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleItemOpened(item: CdkAccordionItem) {
    this.clearStore$.next()

    of(void 0)
      .pipe(delay(0, animationFrameScheduler), take(1))
      .subscribe(() => this.scrollToPosition(item));
  }

  public handleItemClosed() {
    this.clearStore$.next()
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
