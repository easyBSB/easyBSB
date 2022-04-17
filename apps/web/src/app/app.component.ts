import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'easy-bsb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private readonly httpClient: HttpClient) {}

  title = 'web';

  ngOnInit(): void {
    this.httpClient.get('http://localhost:4200/api')
      .subscribe((data) => console.log(data))
  }
}
