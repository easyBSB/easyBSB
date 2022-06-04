import { ipcMain } from "electron";

export interface Command<T = unknown> {
  run(...args): Promise<T> | T;
}

interface CommandConstructor {
  new(): Command;
}

/**
 * @description command registry
 */
class Manager {

  private commandMap: Map<string, { ctor: CommandConstructor, instance: Command }> = new Map();

  registerCommand(event: string, constructor: CommandConstructor) {
    if (!this.commandMap.has(event)) {
      // automatically register the event to ipcMain
      ipcMain.handle(event, (_event, ...payload) => {
        return this.runCommand(event, ...payload);
      });

      this.commandMap.set(event, {
        ctor: constructor,
        instance: null,
      });
    }
  }

  runCommand(action: string, ...args): unknown {
    if (this.commandMap.has(action)) {
      const command = this.commandMap.get(action);
      let instance = command.instance;
      // lazy construct command only if needed
      if (!instance) {
        instance = new command.ctor();
        this.commandMap.set(action, { ...command, instance })
      }
      // run commmand
      return instance.run(...args);
    }
  }

  deleteCommand(action: string) {
    if (!this.commandMap.has(action)) {
      this.commandMap.delete(action);
    }
  }
}

export const CommandManager = new Manager();