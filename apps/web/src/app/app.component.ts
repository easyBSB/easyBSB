import { Component, OnInit } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { filter, map, Observable, switchMap } from "rxjs";
import { AuthorizationService } from "./libs/authorization";

@Component({
  selector: "easy-bsb-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {

  isNotLoginRoute$?: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private authService: AuthorizationService
   ) {}

  ngOnInit(): void {

    /**
     * can activate child is not that good since this
     * emits super often for every child into route
     */
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      switchMap(() => this.authService.isAuthorized())
    ).subscribe((authorized) => {
      !authorized ? this.router.navigate(['/login']) : void 0;
    });

    this.isNotLoginRoute$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event as NavigationEnd),
      map((event) => event.url !== '/login')
    );
  }
}
