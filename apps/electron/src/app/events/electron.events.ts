/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, ipcMain } from "electron";
import { environment } from "../../environments/environment";
import { CommandManager } from "../commands/CommandManager";
import { Commands } from "../commands/Commands.enum";
import { LoginCommand } from "../commands/Login.command";
import { StartServerCommand } from "../commands/StartServer.command";
import { StopServerCommand } from "../commands/StopServer.command";

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

// Retrieve app version
ipcMain.handle("get-app-version", () => {
  console.log(`Fetching application version... [v${environment.version}]`);
  return environment.version;
});

// Handle App termination
ipcMain.on("quit", (event, code) => {
  app.exit(code);
});

CommandManager.registerCommand(Commands.startServer, StartServerCommand);
CommandManager.registerCommand(Commands.stopServer, StopServerCommand);
CommandManager.registerCommand(Commands.login, LoginCommand, true);
