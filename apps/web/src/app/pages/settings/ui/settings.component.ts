/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatLegacyTabChangeEvent as MatTabChangeEvent, MatLegacyTabGroup as MatTabGroup } from "@angular/material/legacy-tabs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { filter, map, Observable } from "rxjs";
import { SettingsSections } from "../constants/settings-sections";

@Component({
  selector: "easy-bsb-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  selectedIndex$: Observable<number>;

  @ViewChild('tabgroup', { read: MatTabGroup, static: true })
  private readonly tabs!: MatTabGroup

  private triggeredManually = false;

  private sections = SettingsSections;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    this.selectedIndex$ = this.registerRouteParamsChange();
  }

  ngOnInit(): void {
    this.tabs.disablePagination = true;
    this.tabs.selectedTabChange.subscribe(
      (event: MatTabChangeEvent) => {
        this.router.navigate(['..', event.tab.ariaLabel], { relativeTo: this.activatedRoute });
      });
  }

  /**
   * @description triggered
   */
  handleClick() {
    this.triggeredManually = true;
  }

  /**
   * @description listen to route params changes so we know if we should
   * change tab view
   */
  private registerRouteParamsChange(): Observable<number> {
    return this.activatedRoute.params
      .pipe(
        filter(() => {
          const passed = this.triggeredManually === false;
          this.triggeredManually = false;
          return passed;
        }),
        map((params: Params) => {
          const section = params['section'].replace(
            /-([a-z]{1}).*?/ig,
            (_full: string, match: string) => match.toUpperCase()
          );
          return Object.keys(this.sections).indexOf(section) ?? 0;
        }),
      );
  }
}
