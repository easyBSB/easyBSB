import { filter, firstValueFrom, map, merge, Observable, Subject } from "rxjs";
import { IOperation, OperationState } from "./api";

export class Queue {

  private queuedItems: IOperation[] = [];

  private isQueueProcessing = false;

  private operationCompleted$ = new Subject<IOperation>();

  add(operation: IOperation): void {
    if (!this.hasOperation(operation)) {
      this.registerOperation(operation);

      if (!this.isQueueProcessing) this.process();
    }
  }

  /** 
   * @description sends data if an operation completes
   */
  get operationCompleted(): Observable<IOperation> {
    return this.operationCompleted$.asObservable();
  }

  /**
   * @description process queue
   */
  private async process() {
    this.isQueueProcessing = true;

    while (this.queuedItems.length > 0) {
      const operation = this.queuedItems.shift() as IOperation;
      const state = await this.execOperation(operation);

      switch (state) {
        case OperationState.CANCELED:
        case OperationState.ERROR:
        case OperationState.COMPLETED:
          this.operationCompleted$.next(operation);
          break;

        case OperationState.RETRY:
          // operation.updateState(OperationState.IDLE);
          this.add(operation);
          break
      }
    }

    this.isQueueProcessing = false;
  }

  /**
   * @description return current state of request
   */
  private async execOperation(operation: IOperation): Promise<unknown> {
    const completed$ = operation.completed.pipe(
      map((result) => result.state)
    );

    const retry$ = operation.state.pipe(
      filter(([current]) => current === OperationState.RETRY),
      map(([current]) => current)
    );

    const state$ = merge(completed$, retry$);
    operation.execute();

    return await firstValueFrom(state$);
  }

  private hasOperation(needle: IOperation): boolean {
    return this.queuedItems.some((operation) => needle === operation);
  }

  private registerOperation(operation: IOperation) {
    this.queuedItems.push(operation)

    operation.state
      .pipe(
        filter(([current, previous]) =>
          current === OperationState.CANCELED && 
          previous !== OperationState.PROCESSING
        ),
      )
      .subscribe(() => this.removeOperation(operation));
  }

  private removeOperation(remove: IOperation): void {
    this.queuedItems = this.queuedItems.filter((operation) => operation !== remove);
  }
}
