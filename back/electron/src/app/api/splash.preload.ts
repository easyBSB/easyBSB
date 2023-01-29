import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("easybsb", {
  // methods to outside
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  platform: process.platform,
  login(username: string, password: string): Promise<unknown> {
    return ipcRenderer.invoke('easybsb.login', username, password);
  },
  close(): void {
    ipcRenderer.send('quit');
  }
});
