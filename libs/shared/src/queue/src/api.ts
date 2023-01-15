import { Observable } from "rxjs";

export enum OperationState {
  IDLE,
  PROCESSING,
  CANCELED,
  ERROR,
  RETRY,
  COMPLETED
}

export interface OperationResult<T = unknown> {
  value: T | undefined;

  state: OperationState;
}

export interface IOperation {

  readonly completed: Observable<OperationResult>;

  /**
   * @description emits on state changes
   * @returns Observable<[currentState, previousState]>
   */
  readonly state: Observable<[OperationState, OperationState]>;

  readonly result: OperationResult;

  /**
   * @description execute operation, should
   * @example
   * 
   * public execute(): void {
   *    // do some operation
   *    const value = 1 + 1;
   *    super.complete(value);
   * }
   */
  execute(): void;
}
