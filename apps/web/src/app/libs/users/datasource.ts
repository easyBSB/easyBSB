import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, animationFrameScheduler, of } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { RequestContextToken } from '../../constants/api';
import { EasyBSBHttpErrorResponse, RequestContext } from '../error-handler/error.interceptor';
import { MessageService } from '../message/message.service';
import { User, UserListItem } from './api';

@Injectable()
export class UserListDatasource {

  private readonly userChange$: Subject<UserListItem[]> = new Subject();

  private userStorage: UserListItem[] = [];

  /**
   * @description persist current user we edit so we have access
   */
  private currentEditUser?: UserListItem;

  /**
   * @description latest state before we edit an user, this ensures
   * if we cancel editing we can set back default data
   */
  private userState?: UserListItem;

  constructor(
    private readonly httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  load(): void {
    this.httpClient.get<User[]>("/api/users")
      .pipe(
        take(1),
        map((users) => users.map((user) => this.mapUser(user)))
      )
      .subscribe((users) => {
        this.userStorage = [...users];
        this.notify();
      });
  }

  /**
   * @description create new phantom user and add to list data
   */
  create() {
    if (this.currentEditUser && this.validate(this.currentEditUser) === false) {
      return;
    }

    const newUser: UserListItem = {
      isPhantom: true,
      mode: 'read',
      raw: { id: Math.random().toString(32), name: '', role: 'read' }
    };

    this.userStorage.push(newUser);
    this.edit(newUser);
  }

  /**
   * @description connect to get changes for users
   */
  connect(): Observable<UserListItem[]> {
    return this.userChange$.pipe(debounceTime(0, animationFrameScheduler));
  }

  edit(item: UserListItem) {
    if (this.currentEditUser) {
      if (!this.validate(this.currentEditUser)) {
        return;
      }
      this.write(this.currentEditUser);
    }

    // persist current state
    this.userState = JSON.parse(JSON.stringify(item));
    item.mode = "write";
    this.currentEditUser = item;
    this.notify();
  }

  cancelEdit(item: UserListItem): void {
    item.mode = "read";
    if (item.isPhantom) {
      this.userStorage  = this.userStorage.filter((user) => user !== item);
    }

    if (!item.isPhantom && this.userState) {
      item.raw = this.userState.raw;
    }

    this.userState = undefined;
    this.currentEditUser = undefined;
    this.notify();
  }

  /**
   * @description persist user into database
   */
  write(item: UserListItem) {
    if (!this.validate(item)) {
      return;
    }

    const isDirty = JSON.stringify(item.raw) !== JSON.stringify(this.userState?.raw);
    if (isDirty) {
      const requestContext = new RequestContext(this.userState?.raw);
      const data$ = !item.isPhantom
        ? this.updateUser(item, requestContext)
        : this.createUser(item, requestContext);

      data$
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const newUser = this.mapUser(response as User);
            this.userStorage = this.userStorage.map((user) => user === item ? newUser : user);
            this.messageService.success(
              item.isPhantom ? `User ${item.raw.name} added.` : `User ${item.raw.name} updated.`
            );
            this.notify();
          },
          error: (response: EasyBSBHttpErrorResponse) => {
            this.handleWriteError(response.httpContext.get() as User);
            this.notify();
          },
        });
    }

    item.mode = 'read'
    this.userState = undefined;
    this.currentEditUser = undefined;
  }

  /**
   * @description remote item from storage and send request if
   * item is not a phantom
   */
  remove(item: UserListItem) {
    const delete$ = item.isPhantom
      ? of(true)
      : this.deleteUser(item)

    delete$
      .pipe(take(1))
      .subscribe(() => {
        this.messageService.success(`User ${item.raw.name} removed`);
        this.userStorage = this.userStorage.filter((user) => user !== item);
        this.notify();
      });
  }

  /**
   * @description validate user if name not allready taken and/or empty
   * this should prevent we switch to a new user for edit while the existing one is
   * invalid
   */
  validate(item: UserListItem): boolean {
    if (item.raw.name.trim() === "") {
      this.messageService.error('Username empty');
      return false;
    }

    // allready taken
    const userNameExists = this.userStorage.some((user) => {
      return user !== item ? user.raw.name === item.raw.name : false;
    });

    if (userNameExists) {
      this.messageService.error('Username allready taken');
      return false;
    }
    return true;
  }

  /**
   * @description handle error if write failed, if create we remove item from list
   * otherweise we replace item in list
   */
  private handleWriteError(state: User): void {
    const item = this.userStorage.find((user) => user.raw.id === state.id);

    if (!item) {
      return;
    }

    this.userStorage = item.isPhantom
      ? this.userStorage.filter((user) => user !== item)
      : this.userStorage.map((user) => user === item ? this.mapUser(state) : user);
  }

  /**
   * @description emit list changes
   */
  private notify() {
    this.userChange$.next(this.userStorage);
  }

  /**
   * @description save user on server
   */
  private createUser(user: UserListItem, reqContext: RequestContext): Observable<User> {
    const {id, ...payload} = user.raw;
    const context = new HttpContext();
    context.set(RequestContextToken, reqContext);
    return this.httpClient.put<User>("/api/users", payload , { context });
  }

  /**
   * @description delete existing user
   */
  private deleteUser(user: UserListItem): Observable<unknown> {
    const { id } = user.raw;
    return this.httpClient.delete("/api/users/" + id);
  }

  /**
   * @description update existing user
   */
  private updateUser(user: UserListItem, reqContext: RequestContext): Observable<User> {
    const {id, ...payload} = user.raw;
    const context = new HttpContext();
    context.set(RequestContextToken, reqContext);
    return this.httpClient.post<User>("/api/users/" + id, payload, { context });
  }

  /**
   * @description map User to UserListItem
   */
  private mapUser(user: User): UserListItem {
    return {
      mode: "read",
      isPhantom: false,
      raw: { ...user, password: '' }
    }
  }
}