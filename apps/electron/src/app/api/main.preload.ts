import { contextBridge, ipcRenderer } from "electron";
import "../commands/Login.command";

contextBridge.exposeInMainWorld("easybsb", {
  // methods to outside
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  platform: process.platform,
  login(username: string, password: string): Promise<unknown> {
    return ipcRenderer.invoke('easybsb.login', username, password);
  }
});
