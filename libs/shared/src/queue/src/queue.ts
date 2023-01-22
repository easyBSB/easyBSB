import {Observable, of, merge} from 'rxjs'
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators'
import {TaskState} from './api'
import {AbstractTask} from './task'

export class Queue<T> {
  public parallelCount = 1

  private activeTasks: AbstractTask[] = []

  private observedTasks = new WeakSet<AbstractTask<T>>()

  private queuedTasks: AbstractTask[] = []

  register<T extends AbstractTask>(...tasks: T[]): void {
    for (const task of tasks) {
      task.addBeforeStartHook(this.createBeforeStartHook(task))
    }
  }

  /**
   * clear queue this will remove all queued tasks and cancel them
   */
  clear() {
    const tasks = [...this.activeTasks, ...this.queuedTasks];
    // clear this directly
    this.queuedTasks = [];
    for (const task of tasks) {
      task.cancel();
    }
  }

  private createBeforeStartHook(request: AbstractTask): Observable<boolean> {
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
        }
      }),
    )
  }

  private registerOnTaskStateChange(task: AbstractTask): void {
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

  private isInTaskQueue(task: AbstractTask): boolean {
    const inQueue = this.queuedTasks.includes(task)
    return inQueue
  }

  private removeFromTaskQueue(request: AbstractTask) {
    this.queuedTasks = this.queuedTasks.filter(upload => upload !== request)
  }

  private startNextInTaskQueue() {
    // muss er den naechsten nehmen der pending idle ist und nichts anderes
    if (this.queuedTasks.length > 0) {
      const nextTask = this.queuedTasks.shift() as AbstractTask
      nextTask.start()
    }
  }

  private taskCompleted(task: AbstractTask) {
    if (this.activeTasks.includes(task)) {
      this.activeTasks = this.activeTasks.filter((active) => task !== active)
    }

    this.isInTaskQueue(task) ? this.removeFromTaskQueue(task) : this.startNextInTaskQueue()
    this.observedTasks.delete(task)
  }

  private writeToTaskQueue(task: AbstractTask) {
    task.state = TaskState.PENDING
    this.queuedTasks = [...this.queuedTasks, task]
  }
}
