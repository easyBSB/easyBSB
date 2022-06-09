import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, map, Observable, take } from "rxjs";
import { UserRoles } from "./user.roles";
import { User, UserService } from "./users.service";

interface UserTableItem {
  mode: "read" | "write";
  isPhantom: boolean;
  raw: User
}

@Component({
  selector: "easy-bsb-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {

  columns = ['name', 'role', 'actions'];
  userData$: Observable<UserTableItem[]>;
  userRoleOptions: [keyof typeof UserRoles, UserRoles][] = [];

  /**
   * @description persist current user we edit so we have access
   */
  private currentEditUser?: UserTableItem;

  /**
   * @description latest state before we edit an user, this ensures
   * if we cancel editing we can set back default data
   */
  private userState?: UserTableItem;

  /**
   * @description current users we have loaded, use behavior subject
   * so we can use getValue() and get all users from datasource
   */
  private users$ = new BehaviorSubject<UserTableItem[]>([]);

  constructor(
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
  ) {
    this.userData$ = this.users$.asObservable();
  }

  ngOnInit(): void {
    for (const [key, value] of Object.entries(UserRoles) ) {
      this.userRoleOptions.push([key, value] as [keyof typeof UserRoles, UserRoles])
    }
    this.fetchUsers();
  }

  /**
   * @description performance booster for mat-table
   */
  trackByUser(_index: number, user: UserTableItem) {
    return user.raw.id;
  }

  /**
   * @description sed mode to write for an user and store the data 
   * inside a user state so we can fallback to initial value.
   */
  editUser(item: UserTableItem) {
    if (this.currentEditUser) {
      if (!this.validate(this.currentEditUser.raw)) {
        return;
      }

      this.currentEditUser.mode = "read";
      if (!!this.userState && JSON.stringify(this.currentEditUser.raw) !== JSON.stringify(this.userState.raw)) {
        this.writeUser(this.currentEditUser);
      }
    }

    item.mode = "write";
    this.userState = JSON.parse(JSON.stringify(item));
    this.currentEditUser = item;
  }

  /**
   * @description delete user
   */
  deleteUser(item: UserTableItem) {
    this.userService.deleteUser(item.raw);
  }

  /**
   * @description persist user in database, if user allready exists he 
   * will updated otherwise (phantom) created.
   */
  writeUser(item: UserTableItem) {
    if (!this.validate(item.raw)) {
      return;
    }

    this.userService.updateUser(item.raw);
    item.mode = "read";

    this.userState = undefined;
    this.currentEditUser = undefined;
  }

  /**
   * @description create new phantom user to list and set edit mode for him
   */
  addUser() {
    if (this.currentEditUser && !this.validate(this.currentEditUser.raw)) {
      return;
    }

    const newUser: UserTableItem = {
      isPhantom: true,
      mode: 'read',
      raw: { id: -1, name: '', role: UserRoles.read }
    };

    const users = this.users$.getValue();
    this.users$.next([...users, newUser]);
    this.editUser(newUser);
  }

  /**
   * @description cancel edit mode for user, this will reset to initial value
   * if user allready exists in database and if the user is a phantom he will
   * removed from list again.
   */
  cancelEdit(item: UserTableItem) {
    item.mode = "read";
    if (this.userState) {
      item.raw = this.userState.raw;
    }

    if (item.isPhantom) {
      const users = this.users$.getValue();
      this.users$.next(users.filter((user) => user !== item));
    }

    this.userState = undefined;
    this.currentEditUser = undefined;
  }

  /**
   * @description resolve all users from database and convert them into table item
   */
  private fetchUsers(): void {
    this.userService.getUsers().pipe(
      map((users) => users.map<UserTableItem>((user) => this.mapToTableUser(user))),
      take(1),
    ).subscribe((users) => this.users$.next(users));
  }

  /**
   * @description map current user to table data
   */
  private mapToTableUser(user: User): UserTableItem {
    return {
      mode: "read",
      isPhantom: false,
      raw: { ...user }
    }
  }

  /**
   * @description validate user if name not allready taken and/or empty
   * this should prevent we switch to a new user for edit while the existing one is
   * invalid
   */
  private validate(value: User): boolean {
    // not empty
    if (value.name.trim() === "") {
      this.snackbar.open('Username empty', 'Error', { duration: 3000});
      return false;
    }

    // allready taken
    const users = this.users$.getValue();
    const userNameExists = users.some((user) => user.raw !== value && user.raw.name === value.name);
    if (userNameExists) {
      this.snackbar.open('Username exists', 'Error', { duration: 3000});
      return false;
    }

    return true;
  }
}
