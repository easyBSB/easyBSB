import { Operation } from "@lib/queue";
import { debounceTime, interval, take } from 'rxjs';

export class SumOperation extends Operation<number> {

  constructor(
    private readonly val1: number,
    private readonly val2: number
  ) {
    super();
  }

  protected process(): void {
    if (isNaN(this.val1) || isNaN(this.val2)) {
      throw `Not a number`;
    }
    super.complete(this.val1 + this.val2);
  }
}

export class AsyncSumOperation extends SumOperation {

  constructor(
    val1: number,
    val2: number,
    private readonly delay: number = 25,
  ) {
    super(val1, val2);
  }

  protected override process(): void {
    const delay = Math.max(this.delay, 25);
    interval(delay + 10)
      .pipe(debounceTime(delay), take(1))
      .subscribe(() => super.process());
  }
}
