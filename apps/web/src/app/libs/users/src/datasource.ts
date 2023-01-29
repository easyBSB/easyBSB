import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListDatasource, ListItem } from '@easy-bsb/web/core/datasource';
import { Observable, tap } from 'rxjs';
import { MessageService } from '@easy-bsb/web/core/message';
import { User, UserRoles } from '../../../interfaces/users';

@Injectable()
export class UserListDatasource extends ListDatasource<User> {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly messageService: MessageService
  ) {
    super();
  }

  protected fetch(): Observable<User[]> {
    return this.httpClient.get<User[]>("/api/users");
  }

  /**
   * @description create phantom
   */
  protected createPhantom(): User {
    return {
      id: Math.random().toString(32),
      name: '',
      role: UserRoles.read 
    };
  }

  /**
   * @description remove user from database
   */
  protected removeEntity(user: User): Observable<unknown> {
    const { id } = user;
    return this.httpClient.delete("/api/users/" + id);
  }

  /**
   * @description update user
   */
  protected updateEntity(user: User, options: Record<string, unknown>): Observable<User> {
    const {id, ...payload} = user;
    return this.httpClient
      .post<User>("/api/users/" + id, payload, options)
      .pipe(
        tap(() => this.messageService.success(`User ${user.name} saved`))
      );
  }

  /**
   * @description validate user before it will be written to database
   */
  protected validate(user: User): boolean {
    if (user.name.trim() === "") {
      this.messageService.error('Username empty');
      return false;
    }

    // allready taken
    const userNameExists = this.storage.some((item) => {
      return user !== item.raw ? item.raw.name === user.name : false;
    });

    if (userNameExists) {
      this.messageService.error('Username allready taken');
      return false;
    }
    return true;
  }

  /**
   * @description write user to database
   */
  protected writeEntity(user: User, options: Record<string, unknown>): Observable<User> {
    const {id, ...payload} = user;
    return this.httpClient.put<User>("/api/users", payload , options)
      .pipe(
        tap((user) => this.messageService.success(`User ${user.name} added`))
      );
  }

  /**
   * @description map User to UserListItem
   */
  protected override mapToListItem(user: User): ListItem<User> {
    const item = super.mapToListItem(user);
    // password required ?
    item.raw = { ...item.raw , password: '' };
    return item
  }
}
