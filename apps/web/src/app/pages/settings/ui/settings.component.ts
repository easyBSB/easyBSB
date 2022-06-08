import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "easy-bsb-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {

  ngOnInit(): void {
    console.log('settings and not empty');
  }
}
