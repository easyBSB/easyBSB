import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuthorizationService } from "./core/authorization";

@Component({
  selector: "easy-bsb-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  loggedIn$?: Observable<boolean>;

  constructor(
    private readonly authService: AuthorizationService,
  ) {}

  ngOnInit(): void {
    this.loggedIn$ = this.authService.stateChange()
      .pipe(
        map((state) => state.loggedIn)
      );
  }
}
