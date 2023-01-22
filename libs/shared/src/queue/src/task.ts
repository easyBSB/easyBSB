import {Observable, Subject, concat, of, ReplaySubject} from 'rxjs'
import {tap, filter, bufferCount, map} from 'rxjs/operators'
import {TaskState} from './api'

export interface ITaskResponse<T = unknown> {
  state: TaskState;
  result?: T;
  error?: Error;
}

// @todo better typings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractTask<T = any> {
  abstract execute(): void;

  private stateChange$ = new ReplaySubject<TaskState>(1)
  private completed$ = new Subject<ITaskResponse<T>>()
  private destroy$ = new Subject<void>()

  private hooks: Record<'beforeStart', Observable<boolean>[]>  = {beforeStart: []}

  private taskResult: T | undefined;
  private taskState: TaskState = TaskState.IDLE;

  /**
   * returns observable which notify if file upload state
   * has been changed
   */
  stateChange: Observable<TaskState> = this.stateChange$.asObservable();

  get completed(): Observable<ITaskResponse<T>> {
    return this.completed$.asObservable()
  }

  get destroyed(): Observable<void> {
    return this.destroy$.asObservable()
  }

  get result(): T | undefined {
    return this.taskResult
  }

  get state(): TaskState {
    return this.taskState
  }

  set state(state: TaskState) {
    this.updateState(state)
  }

  addBeforeStartHook(hook: Observable<boolean>): void {
    this.hooks.beforeStart = [...this.hooks.beforeStart, hook]
  }

  cancel(): void {
    console.log(this.isProgress());
    if (this.isProgress() || this.isPending()) {

      if (this.isProgress()) {
        console.log('cancel')
      }

      this.updateState(TaskState.CANCELED)
      this.destroy()
    }
  }

  complete(result?: T): void {
    this.taskResult = result

    this.updateState(TaskState.COMPLETED)
    this.completed$.next({
      result: this.taskResult,
      state: this.state,
    })

    this.destroy()
  }

  destroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.completed$.complete()
    this.stateChange$.complete()
  }

  error(error: Error): void {
    this.completed$.next({error, state: TaskState.ERROR})
    this.updateState(TaskState.ERROR)
    this.destroy()
  }

  isCanceled(): boolean {
    return this.state === TaskState.CANCELED
  }

  isProgress(): boolean {
    return this.state === TaskState.PROGRESS || this.state === TaskState.START
  }

  isPending(): boolean {
    return this.state === TaskState.PENDING
  }

  isIdle(): boolean {
    return this.state === TaskState.IDLE
  }

  isCompleted(): boolean {
    return this.state === TaskState.COMPLETED
  }

  start(): void {
    if (!this.isIdle() && !this.isPending()) {
      return
    }

    this.beforeStartHook$.pipe(
      filter((isAllowedToStart: boolean) => isAllowedToStart),
      tap(() => this.updateState(TaskState.START)),
    ).subscribe({
      next: ((): void => {
        this.updateState(TaskState.PROGRESS)
        this.execute()
      }),
      error: (error: Error) => console.error(error.message),
    })
  }

  private updateState(state: TaskState): void {
    this.taskState = state
    this.stateChange$.next(state)
  }

  /**
   * call hooks in order, see playground
   */
  private get beforeStartHook$(): Observable<boolean> {
    let hook$: Observable<boolean> = of(true)

    if (this.hooks.beforeStart.length > 0) {
      hook$ = concat(...this.hooks.beforeStart)
      .pipe(
        bufferCount(this.hooks.beforeStart.length),
        map(result => result.every(isReady => isReady)),
      )
    }

    return hook$
  }
}
