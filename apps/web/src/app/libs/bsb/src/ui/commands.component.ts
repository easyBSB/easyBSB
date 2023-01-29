import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import type { Command } from '@easy-bsb/parser';
import { DeviceDataService } from '../utils/bsb.service';
import { FetchParamTask } from '../utils/fetch-param.task';
import { ParameterTaskStore } from '../utils/parameter-task.store';

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
export class CommandsComponent implements OnInit, OnDestroy {

  public commandList: CommandListItem[] = [];
  public tasks: FetchParamTask[] = [];

  private command$ = new ReplaySubject<CommandListItem[]>(1);
  private destroy$ = new Subject<void>();

  constructor(
    private readonly parameterTaskStore: ParameterTaskStore,
    private readonly bsbService: DeviceDataService,
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

  public ngOnInit(): void {
    this.tasks = this.buildFetchParamTasks();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public trackByParameter(_index: number, listItem: CommandListItem) {
    return listItem.command.parameter;
  }

  private buildFetchParamTasks(): FetchParamTask[] {
    const result = [];

    for (const { command } of this.commandList) {
      result.push(new FetchParamTask(this.bsbService, command))
    }

    this.parameterTaskStore.add(...result);
    return result;
  }
}
