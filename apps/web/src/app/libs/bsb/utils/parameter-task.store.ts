import { Injectable } from "@angular/core";
import { Queue } from "@shared/queue";
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
    this.queue.clear();
    this.tasks = [];
  }
}
