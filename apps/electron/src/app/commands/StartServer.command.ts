import { ChildProcess, fork } from "child_process";
import { net } from "electron";
import * as path from "path";
import { AppStateData } from "../AppState";
import EventBus from "../events/EventBus";
import { Events } from "../events/Events.enum";
import { Command } from "./CommandManager";

export class StartServerCommand implements Command {

  private process?: ChildProcess;

  async run(): Promise<void> {
    return this.startServer();
  }

  private async startServer(): Promise<void> {

    if (!this.process) {
      const { signal } = new AbortController();
      const easybsb = path.join(__dirname, "easy-bsb", "main.js");
      const nestjs = fork(easybsb, { stdio: "inherit", signal });

      for (let i = 0; i < 30; i++) {
        try {
          if (await this.pingServer()) {
            this.process = nestjs;
            break;
          }
        } catch (error) {
          if (i === 30) {
            process.stderr.write('could not start server')
            process.kill(9);
          }
        }
        await this.sleep(1000);
      }
    }

    const update: Partial<AppStateData> = {
      serverUp: true,
      nestjsProcessId: this.process.pid
    };
    EventBus.dispatch(Events.easybsbServerStarted, update);
  }

  private pingServer(): Promise<boolean> {

    // wait some time

    return new Promise((resolve, reject) => {
      const request = net.request({
        hostname: "localhost",
        method: "HEAD",
        path: "/api/health",
        port: parseInt(process.env.EASYBSB_PORT, 10) || 3333,
        protocol: "http:",
      });

      request.on("response", (response) => {
        if (response.statusCode === 200) {
          resolve(true);
        }
        reject();
      });

      request.on("error", (error) => {
        console.log(error.message, error.stack);
        resolve(false);
      });

      request.end();
    });
  }

  private sleep(ms): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
