
import { HttpContext } from '@angular/common/http';
import { Observable, Subject, animationFrameScheduler, of } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { RequestContextToken } from '../constants/api';
import { EasyBSBHttpErrorResponse, RequestContext } from '../libs/error-handler/error.interceptor';

export interface ListItem<T> {
  isPhantom: boolean;
  mode: 'read' | 'write';
  raw: T;
}

export abstract class ListDatasource<T extends { id: number | string }> {

  /**
   * @description called to load all items from server
   */
  protected abstract fetch(): Observable<T[]>;

  /**
   * @description called if an phantom item should be created which is added to list
   */
  protected abstract createPhantom(): T;

  /**
   * @description called if a new item should created on server
   */
  protected abstract writeEntity(entity: T, options: Record<string, unknown>): Observable<T>;

  /**
   * @description called if an item should removed from server
   */
  protected abstract removeEntity(entity: T): Observable<unknown>;

  /**
   * @description called if an item should updated to server
   */
  protected abstract updateEntity(entity: T, options: Record<string, unknown>): Observable<T>;

  /**
   * @description validate an item
   */
  protected abstract validate(item: T): boolean;

  protected storage: ListItem<T>[] = [];

  private readonly userChange$: Subject<ListItem<T>[]> = new Subject();

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
    this.fetch()
      .pipe(
        take(1),
        map((items) => items.map((item) => this.mapToListItem(item)))
      )
      .subscribe((items) => {
        this.storage = [...items];
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
      raw: this.createPhantom()
    };

    this.storage.push(newBus);
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
      this.storage = this.storage.filter((bus) => bus !== item);
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
      const context = new HttpContext();
      context.set(RequestContextToken, requestContext);

      const data$ = !item.isPhantom
        ? this.updateEntity(item.raw, { context })
        : this.writeEntity(item.raw, { context });

      data$
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const newUser = this.mapToListItem(response as T);
            this.storage = this.storage.map((bus) => bus === item ? newUser : bus);
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
      : this.removeEntity(item.raw)

    delete$
      .pipe(take(1))
      .subscribe(() => {
        this.storage = this.storage.filter((bus) => bus !== item);
        this.notify();
      });
  }

  /**
   * @description handle error if write failed, if create we remove item from list
   * otherweise we replace item in list
   */
  private handleWriteError(state: T): void {
    const item = this.storage.find((item) => item.raw.id === state.id);

    if (!item) {
      return;
    }

    this.storage = item.isPhantom
      ? this.storage.filter((bus) => bus !== item)
      : this.storage.map((bus) => bus === item ? this.mapToListItem(state) : bus);
  }

  /**
   * @description emit list changes
   */
  private notify() {
    this.userChange$.next(this.storage);
  }

  /**
   * @description map User to ListItem<T>
   */
  protected mapToListItem(item: T): ListItem<T> {
    return {
      mode: "read",
      isPhantom: false,
      raw: { ...item }
    }
  }
}
