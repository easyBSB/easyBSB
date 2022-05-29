#!/usr/bin/env node
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { Command, Flags } = require("@oclif/core");
const { fork } = require("child_process");

// executable to run easybsb server via npx easybsb
class EasyBsbCli extends Command {
  static flags = {
    // show version
    version: Flags.version(),

    //
    help: Flags.help(),
  };

  async run() {
    const packageJson = resolve(__dirname, "../package.json");
    const mainFile = JSON.parse(readFileSync(packageJson).toString("utf-8"));
    const runFile = resolve(__dirname, "..", mainFile.main);

    fork(runFile, { stdio: "inherit" });
  }
}

EasyBsbCli.run().catch(require("@oclif/core/handle"));
