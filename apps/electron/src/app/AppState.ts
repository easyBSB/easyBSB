import EventBus from "./events/EventBus";
import { Events } from "./events/Events.enum";

declare type AppStateData = {
  serverUp: boolean;
  isAuthorized: boolean;
  jwt?: string;
}

class State {

  private observers: Array<(data: AppStateData) => void> = [];

  /**
   * current application state
   */
  private appState: AppStateData  = {
    serverUp: false,
    isAuthorized: false,
  }

  constructor() {
    this.registerEvents();
  }

  stateChanged(handler: (data: AppStateData) => void) {
    return this.subscribe(handler);
  }

  /** 
   * @description subscribe to changes on appstate, also send initial value
   */
  private subscribe(observer) {
    this.observers.push(observer);
    observer(this.appState);

    // return unsubscribe method
    return {
      unsubscribe: () => {
        this.observers = this.observers.filter((handler) => handler !== observer);
      }
    }
  }

  private notifyObservers() {
    for (const observer of this.observers) {
      observer(this.appState)
    }
  }

  private registerEvents() {
    EventBus.register(Events.easybsbServerStarted, () => this.updateState({ serverUp: true }));
    EventBus.register(Events.easybsbServerStopped, () => this.updateState({ serverUp: false }));
    EventBus.register(Events.easybsbIsAuthorized, ({ jwt }) => this.updateState({ isAuthorized: true, jwt }));
  }

  private updateState(state: Partial<AppStateData>): void {
    this.appState = {
      ...this.appState,
      ...state
    };

    this.notifyObservers();
  }
}

const AppState = new State();
export default AppState;
