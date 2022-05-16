import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  name: string;
  role: string;
}

@Component({
  selector: 'easy-bsb-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {

  users$!: Observable<User[]>;

  constructor(private readonly httpClient: HttpClient) {}

  ngOnInit(): void {
    this.users$ = this.httpClient.get<User[]>('/api/users')
  }

  trackByUser(_index: number, user: User) {
    return user.name
  }
}
