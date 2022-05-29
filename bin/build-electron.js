var fs = require("fs/promises");
var os = require("os");
var path = require("path");
var electronBuilder = require("electron-builder");
var loadJSON = require("./utils/load-json");

async function prepareElectronBuild() {
  const source = path.resolve(__dirname, "../dist/apps/server/package.json");
  const target = path.resolve(__dirname, `../dist/apps/electron/package.json`);

  await fs.copyFile(source, target);

  // add electron dependency
  const rootPackageJson = await loadJSON(path.resolve(__dirname, "..", "package.json"));
  const electronPackageJson = await loadJSON(target);

  const packageJson = await loadJSON(target);
  const update = {
    ...packageJson,
    devDependencies: {
      ...(electronPackageJson.devDependencies || {}),
      electron: rootPackageJson.devDependencies.electron,
    }
  }

  await fs.writeFile(target, JSON.stringify(update, null, 2));
}

async function buildElectron() {
  await electronBuilder.build({
    config: {
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
            "!node_modules",
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
    }
  });
}

async function buildElectronPackage() {
  try {
    await prepareElectronBuild()
      .then(() => buildElectron());
  } catch(error) {
    console.trace();
    process.stderr.write(error + os.EOL);
    throw error;
  }
}

buildElectronPackage()
