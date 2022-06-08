import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { Observable } from "rxjs";

interface User {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: "easy-bsb-users",
  standalone: true,
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  imports: [ MatTableModule ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  users$!: Observable<User[]>;

  constructor(private readonly httpClient: HttpClient) {}

  ngOnInit(): void {
    this.users$ = this.httpClient.get<User[]>("/api/users");
  }

  trackByUser(_index: number, user: User) {
    return user.id;
  }
}
