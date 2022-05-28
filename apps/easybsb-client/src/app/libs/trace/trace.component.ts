import { Component, OnInit } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Component({
  selector: "easy-bsb-trace",
  templateUrl: "./trace.component.html",
})
export class EasyBSBTraceComponent implements OnInit {
  constructor(private readonly socketIo: Socket) {}

  ngOnInit(): void {
    // the server sends back a websocket message easy-bsb/trace
    this.socketIo.fromEvent<number>("easy-bsb/trace").subscribe((response) => {
      console.log(response);
    });

    // triggers websocket connection and start stream on server
    this.socketIo.emit("easy-bsb/trace");
  }
}
