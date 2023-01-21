import {Observable, of, merge} from 'rxjs'
import {filter, map, takeUntil, tap} from 'rxjs/operators'
import {TaskState} from './api'
import {AbstractTask} from './task'

export class Queue<T> {
  public parallelCount = 1

  private active = 0

  private observedTasks = new WeakSet<AbstractTask<T>>()

  private queuedTasks: AbstractTask[] = []

  public register<T extends AbstractTask>(...tasks: T[]): void {
    for (const task of tasks) {
      task.addBeforeStartHook(this.createBeforeStartHook(task))
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
      map(() => this.active < this.parallelCount),
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
        filter(state => state === TaskState.START),
        takeUntil(merge(task.destroyed, task.completed)),
      ).subscribe({
        next: () => {
          this.active += 1
        },
        complete: () => {
          this.taskCompleted(task)
        },
      })
    }
  }

  private isInTaskQueue(task: AbstractTask): boolean {
    return this.queuedTasks.includes(task)
  }

  private removeFromTaskQueue(request: AbstractTask) {
    this.queuedTasks = this.queuedTasks.filter(upload => upload !== request)
  }

  private startNextInTaskQueue() {
    this.active = Math.max(this.active - 1, 0)
    if (this.queuedTasks.length > 0) {
      const nextUpload = this.queuedTasks.shift() as AbstractTask
      nextUpload.start()
    }
  }

  private taskCompleted(task: AbstractTask) {
    this.isInTaskQueue(task) ? this.removeFromTaskQueue(task) : this.startNextInTaskQueue()
    this.observedTasks.delete(task)
  }

  private writeToTaskQueue(task: AbstractTask) {
    task.state = TaskState.PENDING
    this.queuedTasks = [...this.queuedTasks, task]
  }
}
