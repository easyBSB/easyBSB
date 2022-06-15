import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, animationFrameScheduler, of } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
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
      const data$ = !item.isPhantom
        ? this.updateUser(item)
        : this.createUser(item.raw);

      data$
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const index = this.userStorage.findIndex((user) => user.raw.id === item.raw.id);
            this.userStorage.splice(index, 1, this.mapUser(response as User));
            this.notify();
            this.messageService.success(
              item.isPhantom ? `User ${item.raw.name} added.` : `User ${item.raw.name} updated.`
            );
          }
        });
    }

    item.mode = "read";
    this.userState = undefined;
    this.currentEditUser = undefined;
  }

  remove(item: UserListItem) {
    const delete$ = item.isPhantom
      ? of(true)
      : this.deleteUser(item)

    delete$
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.messageService.success(`User ${item.raw.name} removed`);
          this.userStorage = this.userStorage.filter((user) => user !== item);
          this.notify();
        },
        error: () => void 0
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
   * @description emit list changes
   */
  private notify() {
    this.userChange$.next(this.userStorage);
  }

  /**
   * @description save user on server
   */
  private createUser(user: User): Observable<User> {
    const {id, ...payload} = user;
    return this.httpClient.post<User>("/api/users", payload);
  }

  private deleteUser(user: UserListItem): Observable<unknown> {
    const { id } = user.raw;
    return this.httpClient.delete("/api/users/" + id);
  }

  private updateUser(user: UserListItem): Observable<unknown> {
    const {id, ...payload} = user.raw;
    return this.httpClient.post("/api/users/" + id, payload);
  }

  private mapUser(user: User): UserListItem {
    return {
      mode: "read",
      isPhantom: false,
      raw: { ...user, password: '' }
    }
  }
}
