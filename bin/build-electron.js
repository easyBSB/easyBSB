const { fchownSync } = require("fs");
var fs = require("fs/promises");
var path = require("path");
var electronBuilder = require("electron-builder");

async function createElectronApp() {
  const source = path.resolve(
    __dirname,
    "../dist/apps/server/package.json"
  );
  const target = path.resolve(
    __dirname,
    `../dist/apps/electron/package.json`
  );

  await fs.copyFile(source, target);

  await electronBuilder.build({
    config: {
      removePackageScripts: true,
      files: [
        {
          from: path.resolve(__dirname, "..", "dist/apps/server"),
          to: "easy-bsb",
          filter: ["!package.json"],
        },
        {
          from: path.resolve(__dirname, "..", "dist/apps/electron"),
          to: "",
          filter: [
            "!dist",
            "!node_modules,",
            "**/*.js",
            "**/*.js.map",
            "package.json",
          ],
        },
      ],
      directories: {
        output: path.resolve(__dirname, "../dist/electron"),
        app: path.resolve(__dirname, "../dist/apps/electron"),
        buildResources: (__dirname, "../dist/tmp/electron"),
      },
    },
  });
}

createElectronApp();
