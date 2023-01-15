import { OperationResult, OperationState, Queue } from "@lib/queue";
import { firstValueFrom, lastValueFrom, merge, take, zip } from "rxjs";
import { AsyncSumOperation, SumOperation } from "./utils/Sum.operation";

describe('Queue', () => {

  let queue: Queue;

  beforeAll(() => {
    queue = new Queue;
  })

  it('should execute sum operation on queue', async () => {
    const syncOperation = new SumOperation(2, 8);
    const completed$ = syncOperation.completed;

    // add to queue
    queue.add(syncOperation);
    const result = await firstValueFrom(completed$);

    expect(result.value).toBe(10);
    expect(result.state).toBe(OperationState.COMPLETED)
  })

  it('should execute sum operation in order', (done) => {
    const sumOperation1 = new AsyncSumOperation(2, 8);
    const sumOperation2 = new SumOperation(3, 1);
    const results: OperationResult<number>[] = [];

    merge(sumOperation1.completed, sumOperation2.completed)
      .pipe(take(2))
      .subscribe({
        next: (result) => results.push(result), 
        complete: () => {
          expect(results).toEqual<OperationResult<number>[]>([
            {
              state: OperationState.COMPLETED,
              value: 10
            },
            {
              state: OperationState.COMPLETED,
              value: 4
            }
          ]);
          done();
        }
      });

    // add to queue
    queue.add(sumOperation1);
    queue.add(sumOperation2);
  })

  it('should not execute canceled operation', async () => {
    const sumOperation1 = new AsyncSumOperation(2, 8);
    const sumOperation2 = new AsyncSumOperation(2, 2);

    const execSpy1 = jest.spyOn(sumOperation1, 'execute');
    const execSpy2 = jest.spyOn(sumOperation2, 'execute');

    const completed$ = zip(sumOperation1.completed, sumOperation2.completed);

    // add to queue
    queue.add(sumOperation1);
    queue.add(sumOperation2);

    sumOperation2.cancel();

    const result = await lastValueFrom(completed$);

    expect(execSpy1).toBeCalled();
    expect(result[0]).toEqual(sumOperation1.result);

    expect(execSpy2).not.toBeCalled();
    expect(result[1]).toEqual(sumOperation2.result);
  })
});
