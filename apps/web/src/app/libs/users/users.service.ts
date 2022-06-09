import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private readonly httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>("/api/users");
  }

  updateUser(user: User): Observable<unknown> {
    const {id, ...payload} = user;
    return this.httpClient.post("/api/users/" + user.id, payload);
  }

  deleteUser(user: User): Observable<unknown> {
    return this.httpClient.delete("/api/users/" + user.id);
  }
}
