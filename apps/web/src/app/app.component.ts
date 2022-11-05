import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuthorizationService } from "./libs/authorization/public-api";
import { SettingsSections } from "./pages/settings/public.api";

@Component({
  selector: "easy-bsb-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  loggedIn$?: Observable<boolean>;

  settingsPage = SettingsSections;

  constructor(
    private readonly authService: AuthorizationService,
   ) { }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.stateChange()
      .pipe(
        map((state) => state.loggedIn)
      );
  }
}
