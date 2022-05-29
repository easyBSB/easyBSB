import { BrowserWindow, net, screen } from "electron";
import { environment } from "../environments/environment";
import { join } from "path";
import { fork } from "child_process";
import * as path from "path";
import { rendererAppPort } from "./constants";

// import { rendererAppPort } from "./constants";
// import * as path from "path";
// import { fork } from "child_process";

export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static mainWindow: Electron.BrowserWindow;
  static splash: Electron.BrowserWindow;
  static application: Electron.App;
  static BrowserWindow;

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

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  private static async onReady() {

    App.initSplashScreen();
    App.initMainWindow();

    // start main server
    if (!App.isDevelopmentMode()) {

      // sleep for 2 seconds so we see the splash screen
      App.sleep(2000);

      const { signal } = new AbortController();
      const easybsb = path.join(__dirname, "easy-bsb", "main.js");
      // maybe we need to kill the process
      fork(easybsb, { stdio: "inherit", signal });

      // bootstrap app process
      for (let i = 0; i < 20; i++) {
        if (await App.waitForStart()) {
          break;
        }
        await App.sleep(100);
      }
    }

    App.splash.close();

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
      alwaysOnTop: true 
    });

    App.splash.loadFile('./assets/splash.html');
    App.splash.center();
    App.splash.webContents.openDevTools();
  }

  private static initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);
    const height = Math.min(720, workAreaSize.height || 720);

    // Create the browser window.
    App.mainWindow = new BrowserWindow({
      width: width,
      height: height,
      show: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, "main.preload.js"),
      },
    });

    App.mainWindow.setTitle("EasyBSB");
    App.mainWindow.setMenu(null);
    App.mainWindow.center();
    App.mainWindow.webContents.openDevTools();

    // if main window is ready to show, close the splash window and show the main window
    App.mainWindow.once("ready-to-show", () => {
      App.mainWindow.show();
    });

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
      // spawn child process not the best the hardcoded url
      App.mainWindow.loadURL(`http://localhost:3333`);
    }
  } 

  private static sleep(amount): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, amount)
    })
  }

  private static waitForStart(): Promise<boolean> {
    return new Promise((resolve) => {
      const request = net.request({
        hostname: 'http://localhost',
        port: 3333,
        path: 'api/health',
        method: 'HEAD'
      });

      request.on("response", (response) => {
        process.stdout.write(response.statusCode.toString());
        resolve(true);
      })

      request.on("error", (error) => {
        process.stdout.write(error.message);
        resolve(false);
      })
      request.end();
    })
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    App.BrowserWindow = browserWindow;
    App.application = app;

    App.application.on("window-all-closed", App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on("ready", App.onReady); // App is ready to load data
    App.application.on("activate", App.onActivate); // App is activated
  }
}
