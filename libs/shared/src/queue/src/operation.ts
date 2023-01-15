import { distinctUntilChanged, filter, map, Observable, ReplaySubject } from "rxjs";
import { OperationState, IOperation, OperationResult } from "./api";

export abstract class Operation<T = unknown> implements IOperation {
  /**
   * @inheritdoc
   */
  protected abstract process(): void;

  /**
   * @description emits if state of operation changes
   */
  private readonly state$: ReplaySubject<[OperationState, OperationState]> = new ReplaySubject(1);

  /**
   * @description current operation state
   */
  private operationState: OperationState = OperationState.IDLE;

  /**
   * @description result of operation
   */
  private operationResult: T | undefined = void 0;

  private isCompleted = false;

  get completed(): Observable<OperationResult<T>> {
    return this.state$.pipe(
      filter(() => this.isCompleted),
      map(() => this.result)
    )
  }

  get result(): OperationResult<T> {
    return {
      state: this.operationState,
      value: this.operationResult
    }
  }

  /**
   * 
   */
  get state(): Observable<[OperationState, OperationState]> {
    return this.state$.pipe(
      distinctUntilChanged()
    );
  }


  execute(): void {
    if (this.operationState !== OperationState.IDLE) {
      return;
    }

    if (this.isDelayed() === true) {
      this.updateState(OperationState.RETRY);
      return;
    }

    try {
      this.updateState(OperationState.PROCESSING);
      this.process();
    } catch(error: unknown) {
      this.error(error as Error);
    }
  }

  /**
   * @description @todo add docs
   */
  cancel(): void {
    this.complete(void 0, OperationState.CANCELED);
  }

  /**
   * @description @todo add docs
   */
  protected error(_error: Error): void {
    this.complete(void 0, OperationState.ERROR);
  }

  /**
   * @description @todo add docs
   */
  protected complete(value: T | undefined, state = OperationState.COMPLETED): void {
    if (!this.isCompleted) {
      this.isCompleted = true;
      this.operationResult = value;

      this.updateState(state);
      this.state$.complete();
    }
  }

  /**
   * @description operation can not execute yet but should not removed
   * from queue. If this return true it will moved to bottom of queue
   */
  protected isDelayed(): boolean {
    return false;
  }

  /**
   * @description update state of operation
   */
  protected updateState(state: OperationState): void {
    const previous = this.operationState;
    const current = state;
    this.operationState = current;
    this.state$.next([current, previous]);
  }
}
