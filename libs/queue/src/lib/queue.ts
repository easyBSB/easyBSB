import {Observable, of, merge, interval, asyncScheduler} from 'rxjs'
import {distinctUntilChanged, filter, finalize, map, takeUntil, takeWhile, tap} from 'rxjs/operators'
import {TaskState} from './api'
import {AbstractTask} from './task'

export class Queue<T extends AbstractTask> {
  public parallelCount = 1

  private activeTasks: T[] = []
  private isQueueSchedulerRunning = false;
  private observedTasks = new WeakSet<T>()
  private queuedTasks: T[] = []

  get ActiveTasks(): T[] {
    return this.activeTasks;
  }

  register(...tasks: T[]): void {
    for (const task of tasks) {
      task.addBeforeStartHook(this.createBeforeStartHook(task))
    }
  }

  registerAndStart(...tasks: T[]): void {
    for (const task of tasks) {
      task.addBeforeStartHook(this.createBeforeStartHook(task))
      task.start()
    }
  }

  private createBeforeStartHook(request: T): Observable<boolean> {
    return of(true).pipe(
      /**
       * before any task starts we registers on it, so we get notified
       * if state has been changed
       */
      tap(() => this.registerOnTaskStateChange(request)),
      /**
       * check active uploads and max uploads we could run
       */
      map(() => this.activeTasks.length < this.parallelCount),
      /**
       * if we could not start task push it into queue
       */
      tap((isStartAble: boolean) => {
        if (!isStartAble) {
          this.writeToTaskQueue(request)
          this.startQueueScheduler()
        }
      }),
    )
  }

  /**
   * simple queue scheduler to checker evey xMS we have a free place in queue
   */
  private startQueueScheduler(): void {
    if (!this.isQueueSchedulerRunning) {
      interval(0, asyncScheduler).pipe(
        takeWhile(() => this.queuedTasks.length > 0),
        filter(() => this.activeTasks.length < this.parallelCount),
        finalize(() => this.isQueueSchedulerRunning = false)
      ).subscribe(() => {
        this.queuedTasks.shift()?.start()
      })
    }
    this.isQueueSchedulerRunning = true;
  }

  private registerOnTaskStateChange(task: T): void {
    if (!this.observedTasks.has(task)) {
      this.observedTasks.add(task)

      const change$ = task.stateChange
      change$.pipe(
        takeUntil(merge(task.destroyed, task.completed)),
        distinctUntilChanged(),
        filter(state => state === TaskState.START),
      ).subscribe({
        next: () => this.activeTasks.push(task),
        complete: () => this.taskCompleted(task),
      })
    }
  }

  private isInTaskQueue(task: T): boolean {
    const inQueue = this.queuedTasks.includes(task)
    return inQueue
  }

  private taskCompleted(task: T) {
    // task is active remove from active tasks
    if (this.activeTasks.includes(task)) {
      this.activeTasks = this.activeTasks.filter((active) => task !== active)
    }

    if (this.isInTaskQueue(task)) { 
      this.queuedTasks = this.queuedTasks.filter(queued => queued !== task)
    }

    this.observedTasks.delete(task)
  }

  private writeToTaskQueue(task: T) {
    task.state = TaskState.PENDING
    this.queuedTasks = [...this.queuedTasks, task]
  }
}
