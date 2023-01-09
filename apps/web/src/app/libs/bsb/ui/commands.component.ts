import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Command } from '@easybsb/parser';
import { from, mergeMap, Observable, of, ReplaySubject, Subject, switchMap, takeUntil, zip } from 'rxjs';
import { DeviceDataService } from '../utils/bsb.service';

interface CommandListItem {
  value: string | number | null; 
  valueLoading: boolean;
  command: Command
};

@Component({
  selector: 'easybsb-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandsComponent implements AfterViewInit, OnDestroy {

  public commandList: CommandListItem[] = [];

  private command$ = new ReplaySubject<CommandListItem[]>(1);

  private destroy$ = new Subject<void>();

  constructor(
    private readonly bsbService: DeviceDataService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  @Input()
  public set commands(commands: Command[]) {
    this.commandList = commands.map((command) => {
      return {
        value: null,
        valueLoading: true,
        command 
      }
    });
    this.command$.next(this.commandList);
  }

  public ngAfterViewInit() {
    this.command$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => from(this.buildParamRequestQueue())),
        mergeMap((requestQueue) => requestQueue)
      )
      .subscribe(([value, index]) => {
        // replace value in queue
        const newItem: CommandListItem = { 
          value,
          valueLoading: false,
          command: this.commandList[index].command
        }
        this.commandList[index] = newItem;
        this.cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public trackByParameter(_index: number, listItem: CommandListItem) {
    return listItem.command.parameter;
  }

  private buildParamRequestQueue(): Observable<[string | number | null, number]>[] {
    const reqQueue: Observable<[string| number | null, number]>[] = []
    for (let i = 0, ln = this.commandList.length; i < ln; i++) {
      const item = this.commandList[i];

      let value$ = this.bsbService.getParamValue(1, item.command.parameter);
      value$ = value$.pipe(takeUntil(this.destroy$));

      reqQueue.push(zip(value$, of(i)));
    }
    return reqQueue;
  }
}
