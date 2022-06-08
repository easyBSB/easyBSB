import { Component, OnInit } from "@angular/core";
import { webSocket } from "rxjs/webSocket";

@Component({
  selector: "easy-bsb-trace",
  templateUrl: "./trace.component.html",
})
export class EasyBSBTraceComponent implements OnInit {

  private readonly webSocket = webSocket('ws://localhost:4200');

  ngOnInit(): void {
    // the server sends back a websocket message easy-bsb/trace
    this.webSocket.subscribe((response) => {
      console.log(response);
    });

    // triggers websocket connection and start stream on server
    this.webSocket.next("easy-bsb/trace");
  }
}
