import SquirrelEvents from "./app/events/squirrel.events";
import ElectronEvents from "./app/events/electron.events";
import { fork } from "child_process";
import { app, BrowserWindow } from "electron";
import App from "./app/app";
import * as path from "path";

const controller = new AbortController();
const { signal } = controller;

export default class Main {
  static initialize() {
    if (SquirrelEvents.handleEvents()) {
      // squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
      app.quit();
    }
  }

  static async bootstrapApp() {
    const easybsb = path.join(__dirname, "easy-bsb", "main.js");
    if (!App.isDevelopmentMode()) {
      fork(easybsb, { stdio: "inherit", signal });
    }

    // start app
    App.main(app, BrowserWindow);
  }

  static bootstrapAppEvents() {
    ElectronEvents.bootstrapElectronEvents();
  }
}

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapAppEvents();
