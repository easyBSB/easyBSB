import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, skip, Subject, takeUntil } from "rxjs";
import { UserListDatasource } from "./datasource";
import { UserListItem, UserRoles } from "./api";

@Component({
  selector: "easy-bsb-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserListDatasource]
})
export class UsersComponent implements OnInit, OnDestroy {

  columns = ['name', 'password', 'role', 'actions'];
  userData$: Observable<UserListItem[]>;
  userRoleOptions: [keyof typeof UserRoles, UserRoles][] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly datasource: UserListDatasource,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.userData$ = this.datasource.connect();
  }

  ngOnInit(): void {
    for (const [key, value] of Object.entries(UserRoles) ) {
      this.userRoleOptions.push([key, value] as [keyof typeof UserRoles, UserRoles])
    }

    this.userData$
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe(() => this.cdRef.markForCheck());

    this.datasource.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @description performance booster for mat-table
   */
  trackByUser(_index: number, user: UserListItem) {
    return user.raw.id;
  }

  /**
   * @description set mode to write for an user and store the data 
   * inside a user state so we can fallback to initial value.
   */
  editUser(item: UserListItem) {
    this.datasource.edit(item);
  }

  /**
   * @description delete user
   */
  deleteUser(item: UserListItem) {
    this.datasource.remove(item);
  }

  /**
   * @description persist user in database, if user allready exists he 
   * will updated otherwise (phantom) created.
   */
  writeUser(item: UserListItem) {
    this.datasource.write(item);
  }

  /**
   * @description create new phantom user to list and set edit mode for him
   */
  addUser() {
    this.datasource.create();
  }

  /**
   * @description cancel edit mode for user, this will reset to initial value
   * if user allready exists in database and if the user is a phantom he will
   * removed from list again.
   */
  cancelEdit(item: UserListItem) {
    this.datasource.cancelEdit(item);
  }
}
