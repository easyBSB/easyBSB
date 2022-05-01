import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'easy-bsb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  ping$!: Observable<{message: string}>;

  title = 'web';

  constructor(private readonly httpClient: HttpClient) {}

  ngOnInit() {
    this.ping$ = this.httpClient.get<{message: string}>('http://localhost:3333/api/ping')
  }
}
