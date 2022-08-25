
import { Observable, Subject, animationFrameScheduler, of } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { EasyBSBHttpErrorResponse, RequestContext } from '../libs/error-handler/error.interceptor';

export interface ListItem<T> {
  isPhantom: boolean;
  mode: 'read' | 'write';
  raw: T;
}

export abstract class ListDatasource<T extends { id: number }> {

  /**
   * @description called to load all items from server
   */
  protected abstract fetchItems(): Observable<T[]>;

  /**
   * @description called if an phantom item should be created which is added to list
   */
  protected abstract createItem(): T;

  /**
   * @description called if a new item should created on server
   */
  protected abstract writeItem(item: T, reqContext: RequestContext): Observable<T>;

  /**
   * @description called if an item should removed from server
   */
  protected abstract removeItem(item: T): Observable<unknown>;

  /**
   * @description called if an item should updated to server
   */
  protected abstract updateItem(item: T, reqContext: RequestContext): Observable<T>;

  /**
   * @description validate an item
   */
  protected abstract validate(item: T): boolean;

  private readonly userChange$: Subject<ListItem<T>[]> = new Subject();

  private itemStorage: ListItem<T>[] = [];

  /**
   * @description persist current bus we edit so we have access
   */
  private currentEditItem?: ListItem<T>;

  /**
   * @description latest state before we edit an item, this ensures
   * if we cancel editing we can set back default data
   */
  private itemState?: ListItem<T>;

  load(): void {
    // should happen in child class
    this.fetchItems()
      .pipe(
        take(1),
        map((items) => items.map((item) => this.mapToListItem(item)))
      )
      .subscribe((items) => {
        this.itemStorage = [...items];
        this.notify();
      });
  }

  /**
   * @description create new phantom bus and add to list data
   */
  create() {
    if (this.currentEditItem && this.validate(this.currentEditItem.raw) === false) {
      return;
    }

    const newBus: ListItem<T> = {
      isPhantom: true,
      mode: 'read',
      raw: this.createItem()
    };

    this.itemStorage.push(newBus);
    this.edit(newBus);
  }

  /**
   * @description connect to get changes for users
   */
  connect(): Observable<ListItem<T>[]> {
    return this.userChange$.pipe(debounceTime(0, animationFrameScheduler));
  }

  edit(item: ListItem<T>) {
    if (this.currentEditItem) {
      if (!this.validate(this.currentEditItem.raw)) {
        return;
      }
      this.write(this.currentEditItem);
    }

    // persist current state
    this.itemState = JSON.parse(JSON.stringify(item));
    item.mode = "write";
    this.currentEditItem = item;
    this.notify();
  }

  cancelEdit(item: ListItem<T>): void {
    item.mode = "read";
    if (item.isPhantom) {
      this.itemStorage = this.itemStorage.filter((bus) => bus !== item);
    }

    if (!item.isPhantom && this.itemState) {
      item.raw = this.itemState.raw;
    }

    this.itemState = undefined;
    this.currentEditItem = undefined;
    this.notify();
  }

  write(item: ListItem<T>) {
    if (!this.validate(item.raw)) {
      return;
    }

    const isDirty = JSON.stringify(item.raw) !== JSON.stringify(this.itemState?.raw);
    if (isDirty) {
      const requestContext = new RequestContext(this.itemState?.raw);

      const data$ = !item.isPhantom
        ? this.updateItem(item.raw, requestContext)
        : this.writeItem(item.raw, requestContext);

      data$
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const newUser = this.mapToListItem(response as T);
            this.itemStorage = this.itemStorage.map((bus) => bus === item ? newUser : bus);
            this.notify();
          },
          error: (response: EasyBSBHttpErrorResponse) => {
            this.handleWriteError(response.httpContext.get() as T);
            this.notify();
          },
        });
    }

    item.mode = 'read'
    this.itemState = undefined;
    this.currentEditItem = undefined;
  }

  /**
   * @description remote item from storage and send request if
   * item is not a phantom
   */
  remove(item: ListItem<T>) {
    const delete$ = item.isPhantom
      ? of(true)
      : this.removeItem(item.raw)

    delete$
      .pipe(take(1))
      .subscribe(() => {
        this.itemStorage = this.itemStorage.filter((bus) => bus !== item);
        this.notify();
      });
  }

  /**
   * @description handle error if write failed, if create we remove item from list
   * otherweise we replace item in list
   */
  private handleWriteError(state: T): void {
    const item = this.itemStorage.find((item) => item.raw.id === state.id);

    if (!item) {
      return;
    }

    this.itemStorage = item.isPhantom
      ? this.itemStorage.filter((bus) => bus !== item)
      : this.itemStorage.map((bus) => bus === item ? this.mapToListItem(state) : bus);
  }

  /**
   * @description emit list changes
   */
  private notify() {
    this.userChange$.next(this.itemStorage);
  }

  /**
   * @description map User to ListItem<T>
   */
  private mapToListItem(item: T): ListItem<T> {
    return {
      mode: "read",
      isPhantom: false,
      raw: { ...item }
    }
  }
}
