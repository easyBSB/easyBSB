import { net } from "electron";
import AppState, { AppStateData } from "../AppState";
import EventBus from "../events/EventBus";
import { Events } from "../events/Events.enum";
import { Command } from "./CommandManager";

export class LoginCommand implements Command {

  private serverStarted: Promise<void>

  constructor() {
    this.serverStarted = new Promise((resolve) => {
      AppState.stateChanged((state) => {
        state.serverUp ? resolve() : void 0;
      })
    })
  }

  run(username: string, password: string): Promise<unknown> {
    // wait for server before we can send the login request
    return this.serverStarted.then(
      () => this.sendRequest({username, password}));
  }

  private sendRequest(payload) {
    return new Promise((resolve, reject) => {
      const request = net.request({
        hostname: "localhost",
        method: "POST",
        path: "/api/auth/login",
        port: parseInt(process.env.EASYBSB_PORT, 10) || 3333,
        protocol: "http:",
      });

      request.setHeader('Content-Type', 'application/json')
      request.write(JSON.stringify(payload));

      request.on("response", (response) => {
        resolve(this.handleResponse(response));
      });

      request.on("error", (error) => {
        console.log(error.message, error.stack);
        reject();
      });

      request.end();
    })
  }

  private handleResponse(response: Electron.IncomingMessage): Promise<unknown> {
    return new Promise((resolve) => {

      response.on('data', (data: Buffer) => {
        const responseData = data.toString('utf-8');
        const body = JSON.parse(responseData);

        // reject throws an very strange json response
        if (response.statusCode !== 201) {
          resolve(JSON.stringify({
            success: false,
            ...body
          }));
          return;
        }

        resolve(JSON.stringify({
          success: true,
          body
        }));

        // emit event we are logged in now
        const update: Partial<AppStateData> = { jwt: body.jwt };
        EventBus.dispatch(Events.easybsbIsAuthorized, update);
      });
    });
  }
}
