import AppState, { AppStateData } from "../AppState";
import EventBus from "../events/EventBus";
import { Events } from "../events/Events.enum";
import { Command } from "./CommandManager";
import * as treekill from "tree-kill";

export class StopServerCommand implements Command {

  private currentAppState?: AppStateData;

  constructor() {
    AppState.stateChanged((state) => this.currentAppState = state);
  }

  run(): void {

    if (this.currentAppState.nestjsProcessId) {
      treekill(this.currentAppState.nestjsProcessId, (error) => {
        process.stdout.write(error.message);
        process.stdout.write(this.currentAppState.nestjsProcessId.toString());
        const update: Partial<AppStateData> = {
          serverUp: false,
          nestjsProcessId: null,
        };
        EventBus.dispatch(Events.easybsbServerStopped, update);
      });
    }
  }
}
