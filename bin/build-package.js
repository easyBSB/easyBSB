var fs = require("fs/promises");
var path = require("path");
var os = require("os");
var copyDirectory = require("./utils/copy");

const { exec } = require("child_process");

/**
 * @description copy ./dist/apps/easybsb-client to ./dist/apps/server
 */
async function copyMigrations() {
  const sourceDir = path.resolve(
    __dirname,
    "../apps/easybsb-server/src/typeorm/migrations"
  );
  const targetDir = path.resolve(
    __dirname,
    "../dist/apps/easybsb-server/migrations"
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
 * @description copy ./dist/apps/easybsb-client to ./dist/apps/server
 */
async function copyClient() {
  const sourceDir = path.resolve(__dirname, "../dist/apps/easybsb-client");
  const targetDir = path.resolve(
    __dirname,
    "../dist/apps/easybsb-server/client"
  );

  try {
    await copyDirectory(sourceDir, targetDir);
  } catch (error) {
    process.stderr.write(
      `could not copy ./dist/apps/easybsb-client to ./dist/apps/server/client, ensure to execute 'npm run build easybsb-client' or 'npm run build:all' before ${os.EOL}`
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
  // root package.json
  const rootPackageJsonPath = path.resolve(__dirname, "..", "package.json");
  const rootPackageJson = JSON.parse(await fs.readFile(rootPackageJsonPath));

  // generated package.json
  const source = path.resolve(
    __dirname,
    "../dist/apps/easybsb-server/package.json"
  );
  const packageJson = JSON.parse(await fs.readFile(source));

  const update = Object.assign({}, packageJson, {
    name: rootPackageJson.name,
    version: rootPackageJson.version,
    description: rootPackageJson.description || "easybsb",
    overrides: {
      ...(rootPackageJson.overrides ?? {}),
    },
    dependencies: {
      ...packageJson.dependencies,
      "sql.js": rootPackageJson.dependencies["sql.js"],
    },
    devDependencies: {
      ...packageJson.devDependencies,
      electron: rootPackageJson.devDependencies.electron,
    },
  });

  fs.writeFile(source, JSON.stringify(update, null, 2));
}

/**
 * @description make server executable so we can run via npx for example
 */
async function makeExecutable() {
  // create bin directory on server
  fs.mkdir(path.resolve(__dirname, "../dist/apps/easybsb-server/bin"), {
    recursive: true,
  });

  // move executable file to server dist directory
  fs.copyFile(
    path.resolve(__dirname, "../apps/easybsb-server/src/bin/easybsb.js"),
    path.resolve(__dirname, "../dist/apps/easybsb-server/bin/easybsb.js")
  );

  // update package.json to add bin property to manifest
  const packageJsonPath = path.resolve(
    __dirname,
    "../dist/apps/easybsb-server/package.json"
  );
  const fileContent = JSON.parse(await fs.readFile(packageJsonPath));

  const newContent = {
    ...fileContent,
    name: "easybsb",
    dependencies: {
      ...fileContent.dependencies,
      "@oclif/core": "1.9.0",
    },
    bin: { easybsb: "./bin/easybsb.js" },
  };

  await fs.writeFile(packageJsonPath, JSON.stringify(newContent, null, 2));
}

copyMigrations();
copyClient();
updatePackageJson();
makeExecutable();
