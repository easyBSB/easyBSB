import { ipcMain } from "electron";
import { Commands } from "./Commands.enum";

export interface Command<T = unknown> {
  run(...args): Promise<T> | T;
}

interface CommandConstructor {
  new(): Command;
}

// for example we have ipcMain
// or we trigger this by our own

/**
 * @description command registry
 */
class Manager {

  private commandMap: Map<string, { ctor: CommandConstructor, instance: Command }> = new Map();

  registerCommand(command: Commands, constructor: CommandConstructor, exposed = false) {
    if (!this.commandMap.has(command)) {

      if (exposed) {
        ipcMain.handle(command, (_event, ...payload) => this.runCommand(command, ...payload));
      }

      this.commandMap.set(command, {
        ctor: constructor,
        instance: null,
      });
    }
  }

  execCommand<T>(command: Commands, ...args): Promise<T> | T  {
    if (this.commandMap.has(command)) {
      return this.runCommand(command, ...args);
    }
  }

  private runCommand<T>(action: string, ...args): Promise<T> | T {
    if (this.commandMap.has(action)) {
      const command = this.commandMap.get(action);
      let instance = command.instance;
      // lazy construct command only if needed
      if (!instance) {
        instance = new command.ctor();
        this.commandMap.set(action, { ...command, instance })
      }
      // run commmand
      return instance.run(...args) as T;
    }
  }

  deleteCommand(action: string) {
    if (!this.commandMap.has(action)) {
      this.commandMap.delete(action);
    }
  }
}

export const CommandManager = new Manager();
