import { net } from "electron";
import { Command } from "./Command.registry";

export class LoginCommand implements Command {

  run(username: string, password: string): Promise<unknown> {
    return this.sendRequest({username, password});
  }

  private sendRequest(payload) {

    return new Promise((resolve, reject) => {
      const request = net.request({
        hostname: "localhost",
        method: "POST",
        path: "/api/auth/login",
        port: parseInt(process.env.EASYBSB_PORT, 10),
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
    return new Promise((resolve, reject) => {

      if (response.statusCode !== 201) {
        reject();
        return;
      }

      response.on('data', (data: Buffer) => {
        const responseData = data.toString('utf-8');
        const response = JSON.parse(responseData);

        resolve(JSON.stringify({
          success: false,
          data: response
        }));
      });
    });
  }
}
