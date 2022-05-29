var fs = require("fs/promises");
var path = require("path");
var os = require("os");
var copyDirectory = require("./utils/copy");
var loadJSON = require("./utils/load-json");

async function copyMigrations() {
  const sourceDir = path.resolve(
    __dirname,
    "../apps/server/src/typeorm/migrations"
  );
  const targetDir = path.resolve(
    __dirname,
    "../dist/apps/server/migrations"
  );

  try {
    await copyDirectory(sourceDir, targetDir);
  } catch (error) {
    process.stderr.write(`could not copy migrations ${os.EOL}`);
    process.stderr.write(`${error} ${os.EOL}`);
    process.exit(1);
  }
}

/**
 * @description copy ./dist/apps/web to ./dist/apps/server/client
 */
async function copyClient() {
  const sourceDir = path.resolve(__dirname, "../dist/apps/web");
  const targetDir = path.resolve(
    __dirname,
    "../dist/apps/server/client"
  );

  try {
    await copyDirectory(sourceDir, targetDir);
  } catch (error) {
    process.stderr.write(
      `could not copy ./dist/apps/web to ./dist/apps/server/client, ensure to execute 'npm run build web -- --configuration=production' or 'npm run build:all' before ${os.EOL}`
    );
    process.stderr.write(`${error} ${os.EOL}`);
    process.exit(1);
  }
}

/**
 * merge root packageJSON data into new generated package.json file
 * to use title, description, overrides and the electron devDependency
 * we need to build the project otherwise installation will fail directly
 */
async function updatePackageJson() {

  const servPackageJsonPath = path.resolve(__dirname, "..", "dist/apps/server/package.json");
  const {
    dependencies,
    devDependencies,
    scripts,
    private,
    ...metaData
  } = await loadJSON(path.resolve(__dirname, "..", "package.json"));

  const servPackageJson = await loadJSON(servPackageJsonPath);
  const update = Object.assign(
    {},
    servPackageJson,
    metaData,
    {
      dependencies: {
        ...servPackageJson.dependencies,
        "sql.js": dependencies["sql.js"],
        "@oclif/core": "1.9.0",
      }
    }
  );

  fs.writeFile(servPackageJsonPath, JSON.stringify(update, null, 2));
}

/**
 * @description make server executable so we can run via npx for example
 */
async function makeExecutable() {
  const binDirectory = path.resolve(__dirname, "../dist/apps/server/bin");
  fs.mkdir( binDirectory, { recursive: true });

  // move executable file to server dist directory
  fs.copyFile(
    path.resolve(__dirname, "../apps/server/src/bin/easybsb.js"),
    path.resolve(binDirectory, "easybsb.js")
  );

  // update package.json to add bin property to manifest
  const packageJsonPath = path.resolve(__dirname, "../dist/apps/server/package.json");
  const content = await loadJSON(packageJsonPath);
  const newContent = {
    ...content,
    bin: { easybsb: "./bin/easybsb.js" }
  };

  await fs.writeFile(packageJsonPath, JSON.stringify(newContent, null, 2));
}

// to keep this in Order
async function run() {
  await copyMigrations();
  await copyClient();
  await updatePackageJson();
  await makeExecutable();
}

run()
