import AppState, { AppStateData } from "../AppState";
import EventBus from "../events/EventBus";
import { Events } from "../events/Events.enum";
import { Command } from "./CommandManager";

export class StopServerCommand implements Command {

  private currentAppState?: AppStateData;

  constructor() {
    AppState.stateChanged((state) => this.currentAppState = state);
  }

  run(): void {
    if (this.currentAppState.nestjsProcessId) {
      process.stdout.write(this.currentAppState.nestjsProcessId.toString());
      process.kill(this.currentAppState.nestjsProcessId, 'SIGTERM');
      const update: Partial<AppStateData> = {
        serverUp: false,
        nestjsProcessId: null,
      };
      EventBus.dispatch(Events.easybsbServerStopped, update);
    }
  }
}
