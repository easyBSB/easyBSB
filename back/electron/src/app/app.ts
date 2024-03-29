import { BrowserWindow, screen, session } from "electron";
import { environment } from "../environments/environment";
import { join } from "path";
import { ChildProcess } from "child_process";
import { Commands } from "./commands/Commands.enum";
import { CommandManager } from "./commands/CommandManager";
import AppState, { AppStateData } from "./AppState";
import { rendererAppPort } from "./constants";


export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static mainWindow: Electron.BrowserWindow;
  static splash: Electron.BrowserWindow;
  static application: Electron.App;
  static BrowserWindow;
  static nestjsProcess: ChildProcess;
  static state?: AppStateData | undefined;

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = "ELECTRON_IS_DEV" in process.env;
    const getFromEnvironment: boolean =
      parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      App.application.quit();
    }
  }

  /**
   * @description initialize all windows and start server
   */
  private static async onReady() {

    // for mac it can happens we join this again ...
    if (App.state?.isAuthorized && App.state?.serverUp) {
      App.showMainWindow();
      return;
    }

    /**
     * problem is very simple, we get initial state and if the state changes
     * 
     * first run serverUP: false, authorized: false
     * second run: serverUp: true, authorized: false
     * third run: serverUp: true, authorized: true -> close splash screen, show main window
     * 
     * close app call stop server
     * 
     * fourth run: serverUp: false, authorized: true
     * 
     * by default i think we need this currently only once so unsubscribe if 
     * we are authorized and show main window.
     * 
     * @TODO find better solution this becomes a bit hacky now
     */
    const subscription = AppState.stateChanged((state) => {
      App.state = state;
      if (state.isAuthorized && state.serverUp === true) {
        App.splash.close();
        App.showMainWindow();

        subscription.unsubscribe();
      }
    });

    /**
     * start main server, this will change state to serverUp: true
     */
    if (!App.isDevelopmentMode()) {
      CommandManager.execCommand(Commands.startServer);
    }

    /**
     * stop server, this will change state to serverUp: false
     */
    [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
      process.on(eventType, () => CommandManager.execCommand(Commands.stopServer));
    });

    App.initSplashScreen();
  }

  private static showMainWindow() {
    const cookie = {url: 'http://localhost', name: 'easybsb-jwt', value: App.state.jwt}
    session.defaultSession.cookies.set(cookie)

    App.initMainWindow();
    App.mainWindow.show();
    App.loadMainWindow();
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.mainWindow === null) {
      App.onReady();
    }
  }

  private static initSplashScreen() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(640, workAreaSize.width || 640);
    const height = Math.min(480, workAreaSize.height || 480);

    App.splash = new BrowserWindow({
      width: width,
      height: height,
      transparent: true,
      frame: false,
      webPreferences: {
        preload: join(__dirname, "splash.preload.js"),
      },
    });

    // App.splash.webContents.openDevTools();
    App.splash.loadFile("./assets/splash.html");
    App.splash.center();

    App.splash.on("closed", () => App.splash = null);
  }

  private static initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);
    const height = Math.min(720, workAreaSize.height || 720);

    // Create the browser window.
    App.mainWindow = new BrowserWindow({
      width: width,
      height: height,
      webPreferences: {
        preload: join(__dirname, "main.preload.js")
      }
    });

    App.mainWindow.setTitle("EasyBSB");
    App.mainWindow.setMenu(null);
    App.mainWindow.center();
    // App.mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    App.mainWindow.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      App.mainWindow = null;
    });
  }

  private static loadMainWindow() {
    // load the index.html of the app.
    if (!App.application.isPackaged) {
      App.mainWindow.loadURL(`http://localhost:${rendererAppPort}`);
    } else {
      App.mainWindow.loadURL(`http://localhost:${process.env.EASYBSB_PORT ?? 3333}`);
    }
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    App.BrowserWindow = browserWindow;
    App.application = app;

    App.application.on("window-all-closed", App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on("ready", App.onReady); // App is ready to load data
    App.application.on("activate", App.onActivate); // App is activated
  }
}
