import { Injectable } from "@angular/core";
import { Queue } from "@easy-bsb/queue";
import { FetchParamTask } from "./fetch-param.task";

@Injectable()
export class ParameterTaskStore {

  private tasks: FetchParamTask[] = [];

  private queue: Queue<FetchParamTask>;

  constructor() {
    this.queue = new Queue<FetchParamTask>()
    this.queue.parallelCount = 3;
  }

  add(...tasks: FetchParamTask[]) {
    this.tasks = [...this.tasks, ...tasks];
    for (const task of tasks) {
      this.queue.register(task);
      task.start()
    }
  }

  clear() {
    for (const task of this.tasks) {
      task.cancel();
    }
    this.tasks = [];
  }
}
