import { ipcMain } from "electron";
import { Commands } from "./Commands.enum";

export interface Command<T = unknown> {
  run(...args): Promise<T> | T;
}

interface CommandConstructor {
  new(): Command;
}

/**
 * @description register and executes commands, every command which is registered
 * will constructed lazy. That means only if we call the command we create 1 instance of
 * the command if not allready exists.
 */
class Manager {

  private commandMap: Map<string, { ctor: CommandConstructor, instance: Command }> = new Map();

  /**
   * @description register a command under given command key, if exposed true it will listen on
   * ipcMain event bus for the specific event.
   */
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

  execCommand<T>(command: Commands, ...args: unknown[]): T  {
    if (this.commandMap.has(command)) {
      return this.runCommand<T>(command, ...args);
    }
  }

  private runCommand<T>(action: string, ...args: unknown[]): T {
    if (this.commandMap.has(action)) {
      const command = this.commandMap.get(action);
      let instance = command.instance;
      if (!instance) {
        instance = new command.ctor();
        this.commandMap.set(action, { ...command, instance })
      }
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
