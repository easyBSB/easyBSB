import type { Command } from "@easybsb/parser/api";
import { AbstractTask } from "@shared/queue";
import { takeUntil } from "rxjs";
import { DeviceDataService } from "./bsb.service";

export class FetchParamTask extends AbstractTask<string | number | null> {

  constructor(
    private readonly deviceDataService: DeviceDataService,
    private readonly command: Command
  ) {
    super();
  }

  execute(): void {
    this.deviceDataService.getParamValue(1, this.command.parameter)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (value) => super.complete(value),
        error: (error: Error) => super.error(error)
      })
  }
}